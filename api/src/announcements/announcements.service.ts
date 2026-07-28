import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AnnouncementsService {
  constructor(private firebaseService: FirebaseService) {}

  async createAnnouncement(data: any, user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      
      const newAnnouncement = {
        subject: data.subject,
        message: data.message,
        audience: data.audience, // 'All Users', 'School Admins Only', 'Teachers Only', 'Students Only'
        status: data.isScheduled ? 'Scheduled' : 'Sent',
        scheduledFor: data.scheduledFor || null,
        schoolId: user.schoolId || 'GLOBAL', // If global admin, applies globally
        authorId: user.uid,
        authorRole: user.role,
        createdAt: new Date().toISOString(),
      };

      const docRef = await db.collection('announcements').add(newAnnouncement);
      return { id: docRef.id, ...newAnnouncement };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create announcement');
    }
  }

  async getAnnouncements(user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      let query: FirebaseFirestore.Query = db.collection('announcements');

      if (user.role === 'super_admin') {
        // Super admin sees all global announcements
        query = query.where('schoolId', '==', 'GLOBAL');
      } else if (user.role === 'school_admin') {
        // School admin sees global + their school's announcements
        // Note: Firestore IN query for this requires proper indexing, but we'll fetch both in app or simple where if permitted
        // For now, fetch school specific ones
        query = query.where('schoolId', '==', user.schoolId);
      } else {
        // Users see ones that target them
        // Complex querying requires composite indices in firestore. We will fetch and filter in app for simplicity.
        query = query.where('schoolId', '==', user.schoolId);
      }

      const snapshot = await query.orderBy('createdAt', 'desc').get();
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter by audience for non-admins
      if (user.role !== 'super_admin' && user.role !== 'school_admin') {
        return docs.filter((doc: any) => 
          doc.audience === 'All Users' || 
          (doc.audience === 'Teachers Only' && user.role === 'teacher') ||
          (doc.audience === 'Students Only' && user.role === 'student')
        );
      }

      return docs;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch announcements');
    }
  }
}
