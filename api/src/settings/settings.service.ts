import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class SettingsService {
  constructor(private firebaseService: FirebaseService) {}

  async getSettings(category: string, user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      const scopeId = user.role === 'super_admin' ? 'GLOBAL' : user.schoolId;
      
      const docRef = db.collection('platform_settings').doc(`${scopeId}_${category}`);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return {}; // Return empty to allow UI to use its defaults
      }
      return doc.data();
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch ${category} settings`);
    }
  }

  async updateSettings(category: string, data: any, user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      const scopeId = user.role === 'super_admin' ? 'GLOBAL' : user.schoolId;
      
      const docRef = db.collection('platform_settings').doc(`${scopeId}_${category}`);
      await docRef.set({
        ...data,
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid
      }, { merge: true });
      
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update ${category} settings`);
    }
  }
}
