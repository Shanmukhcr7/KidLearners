import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class TasksService {
  constructor(private firebaseService: FirebaseService) {}

  async createTask(title: string, target: string, dueDate: string, requestUserRole: string, schoolId?: string) {
    if (requestUserRole !== 'super_admin' && requestUserRole !== 'school_admin') {
      throw new UnauthorizedException('Only admins can create tasks');
    }

    const db = this.firebaseService.getFirestore();
    const taskRef = db.collection('tasks').doc();
    
    const newTask = {
      id: taskRef.id,
      title,
      target,
      dueDate,
      status: 'Active',
      schoolId: schoolId || 'global', // global if created by super_admin without a specific school
      createdAt: new Date(),
    };

    await taskRef.set(newTask);
    return newTask;
  }

  async getTasks(requestUserRole: string, requestUserSchoolId?: string) {
    const db = this.firebaseService.getFirestore();
    let query: any = db.collection('tasks');
    
    // If student or school_admin, only show tasks for their school (and maybe global tasks?)
    // The user requested: "only students who are in the school portal will get only their school tasks every unique school unique student"
    if (requestUserRole !== 'super_admin') {
      if (!requestUserSchoolId) {
        return []; // Safety catch
      }
      query = query.where('schoolId', 'in', [requestUserSchoolId, 'global']);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    
    const tasks: any[] = [];
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      tasks.push({
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      });
    });
    
    return tasks;
  }
}
