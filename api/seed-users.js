const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seed() {
  const users = [
    { email: 'student1@example.com', name: 'Alice Student', role: 'user', xp: 120, level: 2 },
    { email: 'student2@example.com', name: 'Bob Student', role: 'user', xp: 50, level: 1 },
    { email: 'teacher1@example.com', name: 'Carol Teacher', role: 'user', xp: 300, level: 4 },
  ];

  for (let u of users) {
    // avoid duplicates
    const snap = await db.collection('users').where('email', '==', u.email).get();
    if (snap.empty) {
      const res = await db.collection('users').add({ ...u, createdAt: new Date() });
      console.log('Added:', res.id, u.email);
    } else {
      console.log('Already exists:', u.email);
    }
  }
  console.log('Done!');
  process.exit(0);
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
