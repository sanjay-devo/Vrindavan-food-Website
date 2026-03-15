import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use the default database if firestoreDatabaseId is missing or "(default)"
const databaseId = (firebaseConfig as any).firestoreDatabaseId === "(default)" ? undefined : (firebaseConfig as any).firestoreDatabaseId;
export const db = getFirestore(app, databaseId);

export const storage = getStorage(app);
export const rtdb = getDatabase(app, firebaseConfig.databaseURL || undefined);
