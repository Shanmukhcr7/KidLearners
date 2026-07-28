import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AnalyticsService {
  constructor(private firebaseService: FirebaseService) {}

  async getGlobalAnalytics() {
    try {
      const db = this.firebaseService.getFirestore();
      
      // Perform parallel count aggregations
      const usersRef = db.collection('users');
      const coursesRef = db.collection('courses');
      const schoolsRef = db.collection('schools');

      const [usersCount, coursesCount, schoolsCount] = await Promise.all([
        usersRef.count().get(),
        coursesRef.count().get(),
        schoolsRef.count().get()
      ]);

      return {
        totalUsers: usersCount.data().count,
        totalCourses: coursesCount.data().count,
        totalSchools: schoolsCount.data().count,
        activeUsersTrend: "+12%", // In reality, calculate from audit logs or last login
        avgSessionTime: "24m 12s",
        dailyLogins: Math.floor(usersCount.data().count * 0.4), // mock
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch global analytics');
    }
  }

  async getSchoolsAnalytics() {
    try {
      const db = this.firebaseService.getFirestore();
      const schoolsSnapshot = await db.collection('schools').get();
      
      const results = [];
      
      // Fetch aggregate data per school
      for (const doc of schoolsSnapshot.docs) {
        const schoolData = doc.data();
        const schoolId = doc.id;
        
        const studentsCount = await db.collection('users').where('schoolId', '==', schoolId).where('role', '==', 'student').count().get();
        const teachersCount = await db.collection('users').where('schoolId', '==', schoolId).where('role', '==', 'teacher').count().get();
        
        results.push({
          id: schoolId,
          name: schoolData.name,
          students: studentsCount.data().count,
          teachers: teachersCount.data().count,
          score: Math.floor(Math.random() * 30) + 70, // mock score 70-100
          completion: Math.floor(Math.random() * 40) + 60, // mock completion 60-100
        });
      }
      
      return results;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch schools analytics');
    }
  }
}
