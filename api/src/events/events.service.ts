import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class EventsService {
  constructor(private firebaseService: FirebaseService) {}

  async createEvent(data: any, user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      
      const newEvent = {
        title: data.title,
        type: data.type, // Webinar, Class, Competition
        date: data.date,
        time: data.time,
        status: data.status || 'Draft',
        schoolId: user.schoolId || 'GLOBAL', 
        authorId: user.uid,
        attendees: 0,
        createdAt: new Date().toISOString(),
      };

      const docRef = await db.collection('events').add(newEvent);
      return { id: docRef.id, ...newEvent };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async getEvents(user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      let query: FirebaseFirestore.Query = db.collection('events');

      if (user.role === 'super_admin') {
        // Super admin sees all events
      } else {
        query = query.where('schoolId', 'in', [user.schoolId, 'GLOBAL']);
      }

      const snapshot = await query.orderBy('date', 'asc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch events');
    }
  }
}
