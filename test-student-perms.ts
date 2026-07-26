import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getCountFromServer, query, orderBy, limit, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBADmk5win1WgrMIyJPAZJy5jK7vunVuss",
  authDomain: "kid-learner-100ec.firebaseapp.com",
  projectId: "kid-learner-100ec",
  storageBucket: "kid-learner-100ec.firebasestorage.app",
  messagingSenderId: "1086335903139",
  appId: "1:1086335903139:web:7d3bd01d0f11fad4fd6616"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function test() {
  console.log("Testing Student permissions...");
  
  // Student login
  const res = await fetch('http://localhost:3000/api/auth/school-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schoolCode: 'DEMO-123', studentCode: 'STUDENT-01', password: '12345' })
  });
  
  const data = await res.json();
  if (!data.token) {
    console.error("Failed to login as student:", data);
    return;
  }
  
  const { signInWithCustomToken } = await import('firebase/auth');
  await signInWithCustomToken(auth, data.token);
  console.log("Signed in as Student:", auth.currentUser!.uid);

  try {
    const q1 = query(collection(db, 'subjects'), orderBy('name'));
    await getDocs(q1);
    console.log("Subjects query: SUCCESS");
  } catch(e: any) { console.error("Subjects query FAILED:", e.message); }

  try {
    const q2 = query(collection(db, 'chapters'));
    await getDocs(q2);
    console.log("Chapters query: SUCCESS");
  } catch(e: any) { console.error("Chapters query FAILED:", e.message); }

  try {
    const q3 = query(collection(db, 'studentChapterProgress', auth.currentUser!.uid, 'chapters'));
    await getDocs(q3);
    console.log("Progress query: SUCCESS");
  } catch(e: any) { console.error("Progress query FAILED:", e.message); }

  process.exit(0);
}

test();
