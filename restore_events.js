const admin = require('firebase-admin');
const serviceAccount = require('./cykel-32383-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

(async () => {
  const eventsSnapshot = await db.collection('events').get();
  const batch = db.batch();
  
  console.log('\n🔄 UPDATING EVENT DATES TO FUTURE...\n');
  
  // Starting from tomorrow, spread events across next 2 weeks
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 1); // Tomorrow
  baseDate.setHours(10, 0, 0, 0); // 10 AM local time
  
  eventsSnapshot.docs.forEach((doc, index) => {
    const data = doc.data();
    
    // Spread events: every 2 days
    const newDate = new Date(baseDate);
    newDate.setDate(newDate.getDate() + (index * 2));
    
    batch.update(doc.ref, {
      dateTime: admin.firestore.Timestamp.fromDate(newDate)
    });
    
    const oldDate = data.dateTime?.toDate()?.toISOString() || 'N/A';
    const newDateStr = newDate.toISOString();
    
    console.log(`✅ ${data.title}`);
    console.log(`   Old: ${oldDate}`);
    console.log(`   New: ${newDateStr}`);
    console.log('');
  });
  
  await batch.commit();
  console.log(`\n✅ Successfully updated ${eventsSnapshot.size} events!\n`);
  
  process.exit(0);
})();
