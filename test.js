const admin = require('firebase-admin');
const serviceAccount = require('./api/firebase-service-account.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

db.collection('users').get().then(users => {
  console.log('Found users:', users.size);
  users.forEach(doc => {
    console.log(doc.id, doc.data());
  });
  process.exit(0);
}).catch(console.error);
