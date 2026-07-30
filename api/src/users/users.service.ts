import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UsersService {
  constructor(private firebaseService: FirebaseService) {}

  async syncUser(uid: string, email: string, name: string) {
    try {
      const db = this.firebaseService.getFirestore();
      const userRef = db.collection('users').doc(uid);
      
      const doc = await userRef.get();
      if (!doc.exists) {
        // Create new user with default 'user' role or school_admin if email matches a school
        const schoolsSnap = await db.collection('schools').where('adminEmail', '==', email).get();
        let role = 'user';
        let schoolId = null;
        if (!schoolsSnap.empty) {
          role = 'school_admin';
          schoolId = schoolsSnap.docs[0].id;
        }

        await userRef.set({
          email,
          name,
          role,
          xp: 0,
          level: 1,
          schoolId,
          createdAt: new Date(),
        });
        
        const auth = this.firebaseService.getAuth();
        const claims: any = { role };
        if (schoolId) claims.schoolId = schoolId;
        await auth.setCustomUserClaims(uid, claims);

        return { role, isNew: true };
      }
      
      // Return existing user data
      const userData = doc.data();
      let dbRole = userData?.role;
      let dbSchoolId = userData?.schoolId;
      
      // DB auto-heal: If school_admin but no schoolId, find it
      if (dbRole === 'school_admin' && !dbSchoolId) {
        const schoolsSnap = await db.collection('schools').where('adminEmail', '==', email).get();
        if (!schoolsSnap.empty) {
          dbSchoolId = schoolsSnap.docs[0].id;
          await userRef.update({ schoolId: dbSchoolId });
        }
      }
      
      const claims: any = { role: dbRole };
      if (dbSchoolId) {
        claims.schoolId = dbSchoolId;
      }
      
      // Ensure Firebase Auth custom claims match the database
      const auth = this.firebaseService.getAuth();
      await auth.setCustomUserClaims(uid, claims);
      
      return { role: dbRole, isNew: false };
    } catch (err) {
      console.error("Firebase Admin Error in syncUser:", err);
      throw new Error("Failed to sync user with database");
    }
  }

  async getUsers(requestUserRole: string) {
    if (requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Super Admins can view all users');
    }

    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('users').get();
    
    const users: any[] = [];
    snapshot.forEach((doc: any) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  }

  async searchUsersByEmail(emailQuery: string, requestUserRole: string) {
    if (requestUserRole !== 'super_admin' && requestUserRole !== 'school_admin') {
      throw new UnauthorizedException('Only Admins can search users globally');
    }

    if (!emailQuery || emailQuery.length < 3) {
      return [];
    }

    const db = this.firebaseService.getFirestore();
    const normalizedQuery = emailQuery.toLowerCase();
    const endQuery = normalizedQuery + '\uf8ff';
    const snapshot = await db.collection('users')
      .where('email', '>=', normalizedQuery)
      .where('email', '<=', endQuery)
      .limit(50)
      .get();
    
    const users: any[] = [];
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      // Only return users who have the default 'user' role (not already admins/students/teachers)
      if (data.role === 'user') {
        users.push({ id: doc.id, email: data.email, name: data.name });
      }
    });
    
    return users.slice(0, 10);
  }

  async setRole(uid: string, role: string) {
    // SuperAdmin only route
    const auth = this.firebaseService.getAuth();
    
    // Set custom claims in Firebase Auth for secure frontend routing
    await auth.setCustomUserClaims(uid, { role });
    
    // Update Firestore
    const db = this.firebaseService.getFirestore();
    await db.collection('users').doc(uid).update({ role });
    
    return { success: true };
  }

  async inviteStudent(email: string, requestUserRole: string, requestUserSchoolId: string) {
    if (requestUserRole !== 'school_admin' && requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Admins can invite students');
    }
    
    const db = this.firebaseService.getFirestore();

    // Get school name to display in the invite
    const schoolDoc = await db.collection('schools').doc(requestUserSchoolId).get();
    const schoolName = schoolDoc.exists ? schoolDoc.data().name : 'A School';

    const usersSnapshot = await db.collection('users').where('email', '==', email).get();

    if (!usersSnapshot.empty) {
      // User exists, create an invite in student_invites
      const userDoc = usersSnapshot.docs[0];
      await db.collection('student_invites').add({
        userId: userDoc.id,
        email,
        schoolId: requestUserSchoolId,
        schoolName,
        status: 'pending',
        createdAt: new Date(),
      });
      
      return { success: true, message: `Invite sent to ${email}` };
    } else {
      // User doesn't exist yet, we still store it by email so when they register we can link it (or just store it in invites)
      await db.collection('student_invites').add({
        email,
        schoolId: requestUserSchoolId,
        schoolName,
        status: 'pending',
        createdAt: new Date(),
      });
      return { success: true, message: `Invite sent to ${email}` };
    }
  }

  async getStudentInvites(uid: string, email: string) {
    const db = this.firebaseService.getFirestore();
    // We check both by userId and email in case the invite was created before they registered
    const snapshot = await db.collection('student_invites')
      .where('email', '==', email)
      .where('status', '==', 'pending')
      .get();
    
    const invites: any[] = [];
    snapshot.forEach(doc => {
      invites.push({ id: doc.id, ...doc.data() });
    });
    return invites;
  }

  async acceptStudentInvite(inviteId: string, uid: string) {
    const db = this.firebaseService.getFirestore();
    const inviteRef = db.collection('student_invites').doc(inviteId);
    const inviteDoc = await inviteRef.get();
    
    if (!inviteDoc.exists) throw new Error('Invite not found');
    const inviteData = inviteDoc.data();
    if (inviteData.status !== 'pending') throw new Error('Invite is not pending');
    
    // Update invite status
    await inviteRef.update({ status: 'accepted' });
    
    // Update user profile
    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      role: 'student',
      schoolId: inviteData.schoolId
    });
    
    // Update custom claims
    const auth = this.firebaseService.getAuth();
    await auth.setCustomUserClaims(uid, { role: 'student', schoolId: inviteData.schoolId });
    
    return { success: true };
  }

  async rejectStudentInvite(inviteId: string, uid: string) {
    const db = this.firebaseService.getFirestore();
    const inviteRef = db.collection('student_invites').doc(inviteId);
    
    // Simply mark it as rejected
    await inviteRef.update({ status: 'rejected' });
    
    return { success: true };
  }
}
