import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class SchoolsService {
  constructor(private firebaseService: FirebaseService) {}

  async createSchool(name: string, domain: string, adminEmail: string, requestUserRole: string) {
    if (requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Super Admins can create schools');
    }

    const db = this.firebaseService.getFirestore();
    const auth = this.firebaseService.getAuth();
    
    // Try to find the user by email
    let userRecord = null;
    try {
      userRecord = await auth.getUserByEmail(adminEmail);
    } catch (e) {
      // User doesn't exist yet, that's okay, we can just create the school
      console.warn(`Admin email ${adminEmail} not found in Firebase Auth`);
    }

    const schoolRef = db.collection('schools').doc();
    
    const newSchool = {
      id: schoolRef.id,
      name,
      domain,
      adminEmail,
      status: 'Active',
      plan: 'Pro',
      features: {
        courses: true,
        exams: true,
        tasks: true,
        certificates: true,
        leaderboards: true,
        aiTutor: false,
        robotics: false,
        events: false
      },
      createdAt: new Date(),
    };

    await schoolRef.set(newSchool);

    // If user exists, upgrade them immediately
    if (userRecord) {
      const uid = userRecord.uid;
      
      // 1. Update Custom Claims in Firebase Auth
      await auth.setCustomUserClaims(uid, { role: 'school_admin', schoolId: newSchool.id });
      
      // 2. Update Firestore user document
      // We use set with merge: true in case the user hasn't completed their first login sync yet
      await db.collection('users').doc(uid).set({
        role: 'school_admin',
        schoolId: newSchool.id
      }, { merge: true });
    }

    return { school: newSchool, adminAssigned: !!userRecord };
  }

  async getSchools(requestUserRole: string) {
    if (requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Super Admins can view all schools');
    }

    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('schools').get();
    
    const schools: any[] = [];
    snapshot.forEach((doc: any) => {
      schools.push(doc.data());
    });
    
    return schools;
  }

  async getStudents(schoolId: string, requestUserRole: string, requestUserSchoolId: string) {
    if (requestUserRole !== 'school_admin' && requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Unauthorized');
    }
    // Simple check: if school admin, must belong to the school
    if (requestUserRole === 'school_admin' && schoolId !== requestUserSchoolId) {
      throw new UnauthorizedException('Unauthorized to view this school');
    }

    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('users')
      .where('role', '==', 'student')
      .where('schoolId', '==', schoolId)
      .get();
    
    const students: any[] = [];
    snapshot.forEach((doc: any) => {
      students.push({ id: doc.id, ...doc.data() });
    });
    
    return students;
  }

  async getStats() {
    try {
      const db = this.firebaseService.getFirestore();
      
      try {
        const schoolsCountSnap = await db.collection('schools').count().get();
        const studentsCountSnap = await db.collection('users').where('role', '==', 'student').count().get();
        
        return {
          schools: schoolsCountSnap.data().count,
          students: studentsCountSnap.data().count,
        };
      } catch (e) {
        // Fallback if count() is not supported by this firebase-admin version
        const schoolsSnap = await db.collection('schools').get();
        const studentsSnap = await db.collection('users').where('role', '==', 'student').get();
        return {
          schools: schoolsSnap.size,
          students: studentsSnap.size,
        };
      }
    } catch (globalErr) {
      console.error("Firebase Admin Error:", globalErr);
      throw new Error("Failed to fetch statistics from the database");
    }
  }

  async getMyStats(role: string, schoolId: string) {
    if (role !== 'school_admin' || !schoolId) {
      throw new UnauthorizedException('Only School Admins can view their school stats');
    }
    const db = this.firebaseService.getFirestore();
    
    // 0. Get School Name
    const schoolDoc = await db.collection('schools').doc(schoolId).get();
    const schoolName = schoolDoc.exists ? schoolDoc.data()?.name : 'My School';

    // 1. Get total students in this school
    const studentsSnapshot = await db.collection('users')
      .where('role', '==', 'student')
      .where('schoolId', '==', schoolId)
      .get();
      
    let totalXp = 0;
    studentsSnapshot.forEach((doc: any) => {
      const xp = doc.data().xp || 0;
      totalXp += xp;
    });
    const avgXp = studentsSnapshot.size > 0 ? Math.round(totalXp / studentsSnapshot.size) : 0;

    // 2. Get active courses (assuming courses are global for now)
    const coursesSnapshot = await db.collection('courses').where('status', '==', 'Active').get();

    return {
      schoolName,
      totalStudents: studentsSnapshot.size,
      averageXp: avgXp,
      activeCourses: coursesSnapshot.size,
    };
  }

  async updateFeatures(schoolId: string, features: any, requestUserRole: string) {
    if (requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Super Admins can configure platform features');
    }

    const db = this.firebaseService.getFirestore();
    const schoolRef = db.collection('schools').doc(schoolId);
    
    await schoolRef.set({
      features: features
    }, { merge: true });

    return { success: true, message: 'Features updated successfully' };
  }

  async createInviteLink(role: string, schoolId: string, limit: number, expiryDays: number) {
    if (role !== 'school_admin' || !schoolId) {
      throw new UnauthorizedException('Only School Admins can create invite links');
    }

    const db = this.firebaseService.getFirestore();
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    const invite = {
      schoolId,
      token,
      limit,
      currentUsage: 0,
      expiresAt: expiryDate,
      createdAt: new Date(),
      status: 'Active'
    };

    await db.collection('school_invites').doc(token).set(invite);
    return invite;
  }

  async getInviteLinks(role: string, schoolId: string) {
    if (role !== 'school_admin' || !schoolId) {
      throw new UnauthorizedException('Only School Admins can view invite links');
    }

    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('school_invites')
      .where('schoolId', '==', schoolId)
      .orderBy('createdAt', 'desc')
      .get();
      
    const links: any[] = [];
    snapshot.forEach(doc => links.push({ id: doc.id, ...doc.data() }));
    return links;
  }

  async joinSchoolWithToken(token: string, uid: string, email: string) {
    const db = this.firebaseService.getFirestore();
    const auth = this.firebaseService.getAuth();
    
    const inviteRef = db.collection('school_invites').doc(token);
    const inviteDoc = await inviteRef.get();
    
    if (!inviteDoc.exists) {
      throw new UnauthorizedException('Invalid invite link');
    }
    
    const inviteData = inviteDoc.data();
    
    // Check expiry
    if (inviteData?.expiresAt.toDate() < new Date()) {
      await inviteRef.update({ status: 'Expired' });
      throw new UnauthorizedException('Invite link has expired');
    }
    
    // Check limit
    if (inviteData?.currentUsage >= inviteData?.limit) {
      await inviteRef.update({ status: 'Limit Reached' });
      throw new UnauthorizedException('Invite link limit reached');
    }

    // Update user in Firestore
    await db.collection('users').doc(uid).set({
      role: 'student',
      schoolId: inviteData?.schoolId,
      email: email, // ensure email is set if it's a new doc
      xp: 0,
      level: 1
    }, { merge: true });

    // Update custom claims
    await auth.setCustomUserClaims(uid, { role: 'student', schoolId: inviteData?.schoolId });

    // Increment usage
    await inviteRef.update({ currentUsage: (inviteData?.currentUsage || 0) + 1 });

    return { success: true, schoolId: inviteData?.schoolId };
  }
}
