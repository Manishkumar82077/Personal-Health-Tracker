import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    // Local dev — explicit service account credentials from .env
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    // Cloud Functions — Application Default Credentials (automatic)
    initializeApp();
  }
}

export const db = getFirestore();
