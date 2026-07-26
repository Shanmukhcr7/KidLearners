import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AdminService {
  constructor(private firebaseService: FirebaseService) {}

  async getStats() {
    try {
      const db = this.firebaseService.getFirestore();
      const schoolsSnap = await db.collection('schools').get();
      const usersSnap = await db.collection('users').get();
      
      return {
        schools: schoolsSnap.size,
        students: usersSnap.docs.filter(d => d.data().role === 'student').length,
        mrr: 0,
        health: 100
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to fetch admin stats');
    }
  }

  async getSchools() {
    try {
      const db = this.firebaseService.getFirestore();
      const snap = await db.collection('schools').get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to fetch schools');
    }
  }

  async getUsers() {
    try {
      const db = this.firebaseService.getFirestore();
      const snap = await db.collection('users').get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }
}
