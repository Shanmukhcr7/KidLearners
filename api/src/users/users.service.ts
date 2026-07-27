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
      const dbRole = doc.data()?.role;
      
      // Ensure Firebase Auth custom claims match the database (crucial for manual DB edits)
      const auth = this.firebaseService.getAuth();
      await auth.setCustomUserClaims(uid, { role: dbRole });
      
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
    if (requestUserRole !== 'school_admin') {
      throw new UnauthorizedException('Only School Admins can invite students');
    }
    
    // In a real app, this would send an email. For now, we create a pending record.
    const db = this.firebaseService.getFirestore();
    await db.collection('invites').add({
      email,
      schoolId: requestUserSchoolId,
      status: 'pending',
      createdAt: new Date(),
    });

    return { success: true, message: `Invite sent to ${email}` };
  }
}
