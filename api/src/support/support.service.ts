import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class SupportService {
  constructor(private firebaseService: FirebaseService) {}

  async createTicket(data: any, user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      
      // Auto-generate short ID like T-1042
      const counterDoc = await db.collection('metadata').doc('ticketCounter').get();
      let currentId = 1000;
      if (counterDoc.exists) {
        currentId = (counterDoc.data()?.count || 1000) + 1;
      }
      await db.collection('metadata').doc('ticketCounter').set({ count: currentId });
      
      const displayId = `T-${currentId}`;

      const newTicket = {
        displayId,
        subject: data.subject,
        message: data.message,
        status: 'Open',
        priority: data.priority || 'Medium',
        userId: user.uid,
        userEmail: user.email,
        schoolId: user.schoolId || 'GLOBAL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        replies: []
      };

      const docRef = await db.collection('support_tickets').add(newTicket);
      return { id: docRef.id, ...newTicket };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create ticket');
    }
  }

  async getTickets(user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      let query: FirebaseFirestore.Query = db.collection('support_tickets');

      if (user.role === 'super_admin') {
        // Super admins see all tickets
      } else if (user.role === 'school_admin') {
        // School admins see tickets from their school
        query = query.where('schoolId', '==', user.schoolId);
      } else {
        // Users only see their own tickets
        query = query.where('userId', '==', user.uid);
      }

      const snapshot = await query.orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch tickets');
    }
  }

  async replyToTicket(ticketId: string, message: string, user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      const ticketRef = db.collection('support_tickets').doc(ticketId);
      const ticketDoc = await ticketRef.get();
      
      if (!ticketDoc.exists) throw new NotFoundException('Ticket not found');
      const ticketData = ticketDoc.data();
      
      // Authorization
      if (user.role !== 'super_admin' && user.role !== 'school_admin' && ticketData?.userId !== user.uid) {
        throw new UnauthorizedException('Cannot reply to this ticket');
      }

      const newReply = {
        userId: user.uid,
        userEmail: user.email,
        role: user.role,
        message,
        createdAt: new Date().toISOString()
      };

      const currentReplies = ticketData?.replies || [];
      
      await ticketRef.update({
        replies: [...currentReplies, newReply],
        status: user.role === 'super_admin' || user.role === 'school_admin' ? 'Pending' : 'Open',
        updatedAt: new Date().toISOString()
      });

      return { success: true, reply: newReply };
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Failed to reply to ticket');
    }
  }

  async updateTicketStatus(ticketId: string, status: string, user: any) {
    try {
      const db = this.firebaseService.getFirestore();
      const ticketRef = db.collection('support_tickets').doc(ticketId);
      const ticketDoc = await ticketRef.get();
      
      if (!ticketDoc.exists) throw new NotFoundException('Ticket not found');
      
      await ticketRef.update({
        status,
        updatedAt: new Date().toISOString()
      });

      return { success: true, status };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update ticket status');
    }
  }
}
