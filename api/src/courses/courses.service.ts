import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class CoursesService {
  constructor(private firebaseService: FirebaseService) {}

  async createCourse(title: string, description: string, requestUserRole: string, requestUserId: string) {
    if (requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Super Admins can create platform-wide courses');
    }

    const db = this.firebaseService.getFirestore();
    const courseRef = db.collection('courses').doc();
    
    const newCourse = {
      id: courseRef.id,
      title,
      description,
      modules: 0,
      lessons: 0,
      status: 'Draft',
      students: 0,
      createdBy: requestUserId,
      createdAt: new Date(),
    };

    await courseRef.set(newCourse);
    return newCourse;
  }

  async getCourses() {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('courses').orderBy('createdAt', 'desc').get();
    
    const courses: any[] = [];
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      // Ensure we serialize dates properly if needed, for now just pass data
      courses.push({
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      });
    });
    
    return courses;
  }

  async updateCourseStatus(courseId: string, status: string, requestUserRole: string) {
    if (requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Super Admins can update course status');
    }
    const db = this.firebaseService.getFirestore();
    await db.collection('courses').doc(courseId).update({ status });
    return { success: true };
  }
}
