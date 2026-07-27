import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class TasksService {
  constructor(private firebaseService: FirebaseService) {}

  async createTask(title: string, target: string, dueDate: string, requestUserRole: string) {
    if (requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Super Admins can create platform-wide tasks');
    }

    const db = this.firebaseService.getFirestore();
    const taskRef = db.collection('tasks').doc();
    
    const newTask = {
      id: taskRef.id,
      title,
      target,
      dueDate,
      status: 'Active',
      createdAt: new Date(),
    };

    await taskRef.set(newTask);
    return newTask;
  }

  async getTasks() {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('tasks').orderBy('createdAt', 'desc').get();
    
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
