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
        // Create new user with default 'user' role
        await userRef.set({
          email,
          name,
          role: 'user', // default role
          xp: 0,
          level: 1,
          schoolId: null, // assigned later via invite
          createdAt: new Date(),
        });
        return { role: 'user', isNew: true };
      }
      // Return existing user data
      const userData = doc.data();
      const dbRole = userData?.role;
      const dbSchoolId = userData?.schoolId;
      
      const claims: any = { role: dbRole };
      if (dbSchoolId) {
        claims.schoolId = dbSchoolId;
      }
      
      // Ensure Firebase Auth custom claims match the database (crucial for manual DB edits)
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

    const usersSnapshot = await db.collection('users').where('email', '==', email).get();

    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      await userDoc.ref.update({
        schoolId: requestUserSchoolId,
        role: 'student'
      });
      const auth = this.firebaseService.getAuth();
      await auth.setCustomUserClaims(userDoc.id, { role: 'student', schoolId: requestUserSchoolId });
      
      return { success: true, message: `Added ${email} to school directly.` };
    } else {
      await db.collection('invites').add({
        email,
        schoolId: requestUserSchoolId,
        status: 'pending',
        createdAt: new Date(),
      });
      return { success: true, message: `Invite sent to ${email}` };
    }
  }
}
