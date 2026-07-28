import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class CertificatesService {
  constructor(private firebaseService: FirebaseService) {}

  async getTemplates(user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      
      const globalSnapshot = await db.collection('certificate_templates').where('schoolId', '==', 'GLOBAL').get();
      const docs = globalSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      if (user.schoolId && user.schoolId !== 'GLOBAL') {
        const schoolSnapshot = await db.collection('certificate_templates').where('schoolId', '==', user.schoolId).get();
        schoolSnapshot.docs.forEach(d => docs.push({ id: d.id, ...d.data() }));
      }
      
      return docs;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch templates');
    }
  }

  async createTemplate(data: any, user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      const schoolId = user.role === 'super_admin' ? 'GLOBAL' : user.schoolId;

      const newTemplate = {
        name: data.name,
        imageUrl: data.imageUrl || '', // The background template image (from R2 or generic)
        isDefault: data.isDefault || false,
        schoolId,
        createdAt: new Date().toISOString(),
      };

      // If this is set as default, we should unset others for this school
      if (newTemplate.isDefault) {
        const existing = await db.collection('certificate_templates')
          .where('schoolId', '==', schoolId)
          .where('isDefault', '==', true)
          .get();
        
        const batch = db.batch();
        existing.docs.forEach(doc => {
          batch.update(doc.ref, { isDefault: false });
        });
        await batch.commit();
      }

      const docRef = await db.collection('certificate_templates').add(newTemplate);
      return { id: docRef.id, ...newTemplate };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create template');
    }
  }

  async setDefaultTemplate(templateId: string, user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      const schoolId = user.role === 'super_admin' ? 'GLOBAL' : user.schoolId;
      
      // Unset existing default for this school
      const existing = await db.collection('certificate_templates')
        .where('schoolId', '==', schoolId)
        .where('isDefault', '==', true)
        .get();
      
      const batch = db.batch();
      existing.docs.forEach(doc => {
        batch.update(doc.ref, { isDefault: false });
      });
      
      const targetRef = db.collection('certificate_templates').doc(templateId);
      batch.update(targetRef, { isDefault: true });
      
      await batch.commit();
      
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException('Failed to set default template');
    }
  }
}
