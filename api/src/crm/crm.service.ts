import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class CrmService {
  constructor(private firebaseService: FirebaseService) {}

  async getLeads() {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection('crm_leads').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch CRM leads');
    }
  }

  async createLead(data: any) {
    try {
      const db = this.firebaseService.getFirestore();
      
      const newLead = {
        schoolName: data.schoolName,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone || '',
        stage: data.stage || 'New Leads', // 'New Leads', 'Contacted', 'In Trial', 'Converted'
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await db.collection('crm_leads').add(newLead);
      return { id: docRef.id, ...newLead };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create CRM lead');
    }
  }

  async updateLeadStage(id: string, stage: string) {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection('crm_leads').doc(id);
      await docRef.update({ 
        stage,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update lead stage');
    }
  }
}
