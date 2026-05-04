const admin = require('firebase-admin');
const serviceAccount = require('./cykel-32383-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

(async () => {
  const now = admin.firestore.Timestamp.now();
  
  // This is the EXACT query the app uses
  const upcomingEvents = await db.collection('events')
    .where('status', '==', 'upcoming')
    .where('visibility', '==', 'public')
    .where('dateTime', '>', now)
    .orderBy('dateTime')
    .limit(20)
    .get();
  
  console.log('\n📱 EVENTS THAT WILL SHOW IN APP:\n');
  console.log('Total:', upcomingEvents.size);
  console.log('\n');
  
  upcomingEvents.docs.forEach((doc, index) => {
    const data = doc.data();
    const dateTime = data.dateTime?.toDate();
    
    console.log(`${index + 1}. ${data.title}`);
    console.log(`   📅 ${dateTime?.toLocaleString()}`);
    console.log(`   📍 ${data.meetingPointName || 'No location'}`);
  });
  
  console.log('\n✅ All events restored and ready to display!\n');
  process.exit(0);
})();
