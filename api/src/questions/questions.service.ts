import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class QuestionsService {
  constructor(private firebaseService: FirebaseService) {}

  async createQuestion(data: any, user: any) {
    try {
      const newQuestion = {
        ...data,
        schoolId: user.role === 'super_admin' ? 'GLOBAL' : user.schoolId || 'UNKNOWN',
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await this.firebaseService.getFirestore().collection('questions').add(newQuestion);
      return { id: docRef.id, ...newQuestion };
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to create question');
    }
  }

  async getQuestions(user: any) {
    try {
      let query: FirebaseFirestore.Query = this.firebaseService.getFirestore().collection('questions');
      
      if (user.role !== 'super_admin') {
        query = query.where('schoolId', 'in', ['GLOBAL', user.schoolId || 'UNKNOWN']);
      }
      
      const snapshot = await query.orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to fetch questions');
    }
  }

  async updateQuestion(id: string, data: any, user: any) {
    try {
      const docRef = this.firebaseService.getFirestore().collection('questions').doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw new NotFoundException('Question not found');
      }
      
      const existingData = doc.data();
      if (user.role !== 'super_admin' && existingData?.schoolId === 'GLOBAL') {
        throw new UnauthorizedException('School admins cannot modify global questions');
      }

      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await docRef.update(updateData);
      return { id, ...existingData, ...updateData };
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Failed to update question');
    }
  }

  async deleteQuestion(id: string, user: any) {
    try {
      const docRef = this.firebaseService.getFirestore().collection('questions').doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw new NotFoundException('Question not found');
      }
      
      const existingData = doc.data();
      if (user.role !== 'super_admin' && existingData?.schoolId === 'GLOBAL') {
        throw new UnauthorizedException('School admins cannot delete global questions');
      }

      await docRef.delete();
      return { message: 'Question deleted successfully' };
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Failed to delete question');
    }
  }
}
