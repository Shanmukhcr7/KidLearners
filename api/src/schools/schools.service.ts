import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class SchoolsService {
  constructor(private firebaseService: FirebaseService) {}

  async createSchool(name: string, domain: string, adminEmail: string, requestUserRole: string) {
    if (requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Super Admins can create schools');
    }

    const db = this.firebaseService.getFirestore();
    const schoolRef = db.collection('schools').doc();
    
    const newSchool = {
      id: schoolRef.id,
      name,
      domain,
      adminEmail,
      status: 'Active',
      plan: 'Pro',
      createdAt: new Date(),
    };

    await schoolRef.set(newSchool);
    return newSchool;
  }

  async getSchools(requestUserRole: string) {
    if (requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Super Admins can view all schools');
    }

    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('schools').get();
    
    const schools: any[] = [];
    snapshot.forEach((doc: any) => {
      schools.push(doc.data());
    });
    
    return schools;
  }

  async getStudents(schoolId: string, requestUserRole: string, requestUserSchoolId: string) {
    if (requestUserRole !== 'school_admin' && requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Unauthorized');
    }
    // Simple check: if school admin, must belong to the school
    if (requestUserRole === 'school_admin' && schoolId !== requestUserSchoolId) {
      throw new UnauthorizedException('Unauthorized to view this school');
    }

    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('users')
      .where('role', '==', 'student')
      .where('schoolId', '==', schoolId)
      .get();
    
    const students: any[] = [];
    snapshot.forEach((doc: any) => {
      students.push({ id: doc.id, ...doc.data() });
    });
    
    return students;
  }

  async getStats() {
    try {
      const db = this.firebaseService.getFirestore();
      
      try {
        const schoolsCountSnap = await db.collection('schools').count().get();
        const studentsCountSnap = await db.collection('users').where('role', '==', 'student').count().get();
        
        return {
          schools: schoolsCountSnap.data().count,
          students: studentsCountSnap.data().count,
        };
      } catch (e) {
        // Fallback if count() is not supported by this firebase-admin version
        const schoolsSnap = await db.collection('schools').get();
        const studentsSnap = await db.collection('users').where('role', '==', 'student').get();
        return {
          schools: schoolsSnap.size,
          students: studentsSnap.size,
        };
      }
    } catch (globalErr) {
      console.error("Firebase Admin Error:", globalErr);
      throw new Error("Failed to fetch statistics from the database");
    }
  }
}
