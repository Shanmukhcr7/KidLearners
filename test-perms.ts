import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, onSnapshot, getDocs, doc, getDoc } from 'firebase/firestore';

// Replace with actual config from .env.local
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
  console.log("Testing permissions...");
  
  // 1. Get a custom token to sign in as the student
  const res = await fetch('http://localhost:3000/api/auth/school-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schoolCode: 'DEMO-123', studentCode: 'STUDENT-01', password: '12345' })
  });
  
  const data = await res.json();
  if (!data.token) {
    console.error("Failed to get token:", data);
    return;
  }
  
  await signInWithCustomToken(auth, data.token);
  console.log("Signed in as student:", auth.currentUser!.uid);
  
  const studentId = auth.currentUser!.uid;

  // Test 1: Get School
  try {
    const schoolSnap = await getDoc(doc(db, 'schools', 'school_demo_123'));
    console.log("School read:", schoolSnap.exists() ? "SUCCESS" : "NOT FOUND");
  } catch (e: any) {
    console.error("School read FAILED:", e.message);
  }

  // Test 2: Subjects
  try {
    const subQ = query(collection(db, 'subjects'), orderBy('name'));
    const snap = await getDocs(subQ);
    console.log("Subjects read: SUCCESS", snap.size, "documents");
  } catch (e: any) {
    console.error("Subjects read FAILED:", e.message);
  }

  // Test 3: Chapters
  try {
    const chapQ = query(collection(db, 'chapters'));
    const snap = await getDocs(chapQ);
    console.log("Chapters read: SUCCESS", snap.size, "documents");
  } catch (e: any) {
    console.error("Chapters read FAILED:", e.message);
  }

  // Test 4: Progress
  try {
    const progressQ = collection(db, 'studentChapterProgress', studentId, 'chapters');
    const snap = await getDocs(progressQ);
    console.log("Progress read: SUCCESS", snap.size, "documents");
  } catch (e: any) {
    console.error("Progress read FAILED:", e.message);
  }
  
  process.exit(0);
}

test();
