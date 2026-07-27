import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuditLogsService {
  constructor(private firebaseService: FirebaseService) {}

  async logAction(action: string, requestUserRole: string, requestUserId: string, requestUserEmail: string, ip: string) {
    const db = this.firebaseService.getFirestore();
    const logRef = db.collection('audit_logs').doc();
    
    const newLog = {
      id: logRef.id,
      action,
      role: requestUserRole,
      user: requestUserEmail,
      userId: requestUserId,
      ip: ip || 'Unknown',
      timestamp: new Date(),
    };

    await logRef.set(newLog);
    return newLog;
  }

  async getLogs(requestUserRole: string) {
    if (requestUserRole !== 'super_admin') {
      throw new UnauthorizedException('Only Super Admins can view audit logs');
    }

    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('audit_logs').orderBy('timestamp', 'desc').limit(50).get();
    
    const logs: any[] = [];
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      logs.push({
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp
      });
    });
    
    return logs;
  }
}
