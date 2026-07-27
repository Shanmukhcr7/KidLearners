import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class ExamsService {
  constructor(private firebaseService: FirebaseService) {}

  async createExam(title: string, duration: string, totalQuestions: number, requestUserRole: string) {
    if (requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Super Admins can create platform-wide exams');
    }

    const db = this.firebaseService.getFirestore();
    const examRef = db.collection('exams').doc();
    
    const newExam = {
      id: examRef.id,
      title,
      duration,
      totalQuestions,
      status: 'Active',
      createdAt: new Date(),
    };

    await examRef.set(newExam);
    return newExam;
  }

  async getExams() {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('exams').orderBy('createdAt', 'desc').get();
    
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
