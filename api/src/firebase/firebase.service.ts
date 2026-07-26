import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: App;

  onModuleInit() {
    if (getApps().length === 0) {
      // Use the provided service account key to authenticate with Firebase
      const serviceAccount = require('../../service-account.json');
      
      this.app = initializeApp({
        credential: cert(serviceAccount),
        // projectId: 'kid-learners',
      });
    } else {
      this.app = getApp();
    }
  }

  getAuth() {
    return getAuth(this.app);
  }

  getFirestore() {
    // The user created a named database called "kidlearners" instead of "(default)"
    return getFirestore(this.app, "kidlearners");
  }
}
