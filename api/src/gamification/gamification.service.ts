import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class GamificationService {
  constructor(private firebaseService: FirebaseService) {}

  async getSettings(user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      const schoolId = user.role === 'super_admin' ? 'GLOBAL' : user.schoolId;
      
      const docRef = db.collection('gamification_settings').doc(schoolId);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        // Return defaults
        return {
          lessonXp: 50,
          quizPerfectXp: 150,
          dailyLoginXp: 10,
          enableGlobalLeaderboard: true,
          enableSchoolLeaderboard: true,
          resetMonthly: true
        };
      }
      return doc.data();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch settings');
    }
  }

  async updateSettings(data: any, user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      const schoolId = user.role === 'super_admin' ? 'GLOBAL' : user.schoolId;
      
      const docRef = db.collection('gamification_settings').doc(schoolId);
      await docRef.set({
        ...data,
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid
      }, { merge: true });
      
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update settings');
    }
  }

  async getBadges(user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      // Fetch GLOBAL badges + school specific badges
      const globalSnapshot = await db.collection('gamification_badges').where('schoolId', '==', 'GLOBAL').get();
      const docs = globalSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      if (user.schoolId && user.schoolId !== 'GLOBAL') {
        const schoolSnapshot = await db.collection('gamification_badges').where('schoolId', '==', user.schoolId).get();
        schoolSnapshot.docs.forEach(d => docs.push({ id: d.id, ...d.data() }));
      }
      return docs;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch badges');
    }
  }

  async createBadge(data: any, user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      
      const newBadge = {
        name: data.name,
        description: data.description,
        iconUrl: data.iconUrl || '',
        schoolId: user.role === 'super_admin' ? 'GLOBAL' : user.schoolId,
        createdAt: new Date().toISOString(),
      };

      const docRef = await db.collection('gamification_badges').add(newBadge);
      return { id: docRef.id, ...newBadge };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create badge');
    }
  }
}
