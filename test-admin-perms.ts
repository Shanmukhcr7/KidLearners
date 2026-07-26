import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
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
  console.log("Testing Admin permissions...");
  
  // Actually, we must use the custom token via admin-login to get the role claim!
  const res = await fetch('http://localhost:3000/api/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@kidlearners.com', password: 'password123' })
  });
  
  const data = await res.json();
  if (!data.token) {
    console.error("Failed to login as admin:", data);
    return;
  }
  
  await signInWithCustomToken(auth, data.token);
  console.log("Signed in as Admin:", auth.currentUser!.uid);

  try {
    const sc = await getCountFromServer(collection(db, 'schools'));
    console.log("Schools count:", sc.data().count);
  } catch(e: any) { console.error("Schools count FAILED:", e.message); }

  try {
    const stc = await getCountFromServer(collection(db, 'students'));
    console.log("Students count:", stc.data().count);
  } catch(e: any) { console.error("Students count FAILED:", e.message); }

  try {
    const subc = await getCountFromServer(collection(db, 'subjects'));
    console.log("Subjects count:", subc.data().count);
  } catch(e: any) { console.error("Subjects count FAILED:", e.message); }

  try {
    const topQ = query(collection(db, 'schools'), orderBy('rank', 'asc'), limit(5));
    const snap = await getDocs(topQ);
    console.log("Top Schools query SUCCESS");
  } catch(e: any) { console.error("Top Schools query FAILED:", e.message); }

  process.exit(0);
}

test();
