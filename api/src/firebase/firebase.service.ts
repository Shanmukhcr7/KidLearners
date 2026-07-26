import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: App;

  onModuleInit() {
    if (getApps().length === 0) {
      let serviceAccount;
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Use environment variable for production (Coolify)
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } else {
        // Use local file for development
        serviceAccount = require('../../service-account.json');
      }
      
      this.app = initializeApp({
        credential: cert(serviceAccount),
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
