import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class DemoService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createRequest(userId: string, data: any) {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection('demo_requests').doc();
      
      await docRef.set({
        ...data,
        userId,
        createdAt: new Date(),
        status: 'pending'
      });
      
      return { id: docRef.id, message: 'Demo request received' };
    } catch (err) {
      console.error("Firebase Admin Error in createRequest:", err);
      throw new Error("Failed to save demo request");
    }
  }

  async getRequests(role: string) {
    if (role !== 'super_admin') {
      throw new UnauthorizedException('Only super admins can view demo requests');
    }
    
    const db = this.firebaseService.getFirestore();
    console.log(`[DemoService] Fetching demo requests for role: ${role}`);
    try {
      const snapshot = await db.collection('demo_requests').orderBy('createdAt', 'desc').get();
      
      const requests: any[] = [];
      snapshot.forEach((doc: any) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      console.log(`[DemoService] Found ${requests.length} demo requests.`);
      return requests;
    } catch (e) {
      console.error("[DemoService] Error fetching demo requests:", e);
      throw e;
    }
  }
}
