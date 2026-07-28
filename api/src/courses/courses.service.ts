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

  async addModule(courseId: string, title: string, description: string, requestUserRole: string) {
    if (requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Super Admins can edit courses');
    }
    const db = this.firebaseService.getFirestore();
    
    // Get current modules count
    const courseRef = db.collection('courses').doc(courseId);
    const courseDoc = await courseRef.get();
    const order = courseDoc.exists ? (courseDoc.data()?.modules || 0) + 1 : 1;

    const moduleRef = db.collection(`courses/${courseId}/modules`).doc();
    const newModule = {
      id: moduleRef.id,
      title,
      description,
      order,
      createdAt: new Date(),
    };
    
    await moduleRef.set(newModule);
    await courseRef.update({ modules: order });
    
    return newModule;
  }

  async getModules(courseId: string) {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(`courses/${courseId}/modules`).orderBy('order', 'asc').get();
    
    const modules: any[] = [];
    snapshot.forEach((doc: any) => modules.push(doc.data()));
    return modules;
  }

  async addLesson(courseId: string, moduleId: string, title: string, content: string, type: string, requestUserRole: string) {
    if (requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Super Admins can edit courses');
    }
    const db = this.firebaseService.getFirestore();
    
    const moduleRef = db.collection(`courses/${courseId}/modules`).doc(moduleId);
    const moduleDoc = await moduleRef.get();
    const order = moduleDoc.exists ? (moduleDoc.data()?.lessons || 0) + 1 : 1;

    const lessonRef = db.collection(`courses/${courseId}/modules/${moduleId}/lessons`).doc();
    const newLesson = {
      id: lessonRef.id,
      title,
      content,
      type, // 'video', 'text', 'quiz'
      order,
      createdAt: new Date(),
    };
    
    await lessonRef.set(newLesson);
    await moduleRef.update({ lessons: order });
    
    // Update global course lesson count
    const courseRef = db.collection('courses').doc(courseId);
    const courseDoc = await courseRef.get();
    if (courseDoc.exists) {
      await courseRef.update({ lessons: (courseDoc.data()?.lessons || 0) + 1 });
    }
    
    return newLesson;
  }

  async getLessons(courseId: string, moduleId: string) {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(`courses/${courseId}/modules/${moduleId}/lessons`).orderBy('order', 'asc').get();
    
    const lessons: any[] = [];
    snapshot.forEach((doc: any) => lessons.push(doc.data()));
    return lessons;
  }
}
