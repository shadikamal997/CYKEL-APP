const admin = require('firebase-admin');
admin.initializeApp();

async function getUsers() {
  const snapshot = await admin.firestore().collection('users').orderBy('createdAt', 'desc').limit(10).get();
  
  console.log('\n📋 Recent Users:\n');
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`👤 ${data.displayName || 'No name'}`);
    console.log(`   Email: ${data.email || 'N/A'}`);
    console.log(`   ID: ${doc.id}`);
    console.log(`   FCM: ${data.fcmToken ? '✅' : '❌'}`);
    console.log(`   Location: ${data.location ? '✅' : '❌'}`);
    console.log('');
  });
  
  process.exit(0);
}

getUsers().catch(e => { console.error(e); process.exit(1); });
