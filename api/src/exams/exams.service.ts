import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class ExamsService {
  constructor(private firebaseService: FirebaseService) {}

  async createExam(title: string, duration: string, totalQuestions: number, requestUserRole: string, schoolId?: string) {
    if (requestUserRole !== 'super_admin' && requestUserRole !== 'school_admin') {
      throw new UnauthorizedException('Only admins can create exams');
    }

    const db = this.firebaseService.getFirestore();
    const examRef = db.collection('exams').doc();
    
    const newExam = {
      id: examRef.id,
      title,
      duration,
      totalQuestions,
      status: 'Active',
      schoolId: schoolId || 'global',
      createdAt: new Date(),
    };

    await examRef.set(newExam);
    return newExam;
  }

  async getExams(requestUserRole: string, requestUserSchoolId?: string) {
    const db = this.firebaseService.getFirestore();
    let query: any = db.collection('exams');

    if (requestUserRole !== 'super_admin') {
      if (!requestUserSchoolId) {
        return [];
      }
      query = query.where('schoolId', 'in', [requestUserSchoolId, 'global']);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    
    const exams: any[] = [];
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      exams.push({
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      });
    });
    
    return exams;
  }
}
