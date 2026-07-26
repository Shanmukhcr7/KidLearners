// Firebase Admin SDK — server-side only (API routes)
// Lazy initialization to avoid build-time errors when env vars aren't set
import { cert, getApps, initializeApp, App } from 'firebase-admin/app'
import { getAuth }      from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

let _adminApp: App | null = null

function getAdminApp(): App {
  if (_adminApp) return _adminApp
  if (getApps().length > 0) {
    _adminApp = getApps()[0]
    return _adminApp
  }

  let serviceAccount;
  try {
    // Attempt to load the JSON file that was pushed to the workspace root
    serviceAccount = require('../../../kid-learner-100ec-firebase-adminsdk-fbsvc-da7fa7f395.json')
  } catch (err) {
    throw new Error('Could not load firebase service account JSON file. Make sure it exists in the root directory.')
  }

  _adminApp = initializeApp({ 
    credential: cert(serviceAccount) 
  })
  return _adminApp
}

// Lazy accessors — only initialize when actually called (not at build time)
export const adminAuth = { get: () => getAuth(getAdminApp()) }
export const adminDb   = { get: () => getFirestore(getAdminApp()) }

// For convenience — these are the real objects, lazily constructed
export function getAdminAuth() { return getAuth(getAdminApp()) }
export function getAdminDb()   { return getFirestore(getAdminApp()) }
