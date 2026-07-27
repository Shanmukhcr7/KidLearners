import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class LeaderboardsService {
  constructor(private firebaseService: FirebaseService) {}

  async getGlobalLeaderboard() {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('users')
      .where('role', '==', 'student')
      .orderBy('xp', 'desc')
      .limit(100)
      .get();
    
    const users: any[] = [];
    let rank = 1;
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        rank: rank++,
        name: data.name,
        schoolId: data.schoolId || 'Unknown',
        xp: data.xp || 0,
        level: data.level || 1,
      });
    });
    
    return users;
  }

  async getSchoolLeaderboard(schoolId: string) {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('users')
      .where('role', '==', 'student')
      .where('schoolId', '==', schoolId)
      .orderBy('xp', 'desc')
      .limit(50)
      .get();
    
    const users: any[] = [];
    let rank = 1;
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        rank: rank++,
        name: data.name,
        xp: data.xp || 0,
        level: data.level || 1,
      });
    });
    
    return users;
  }
}
