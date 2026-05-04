const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'cykel-32383'
});
const db = admin.firestore();

async function investigate() {
  console.log('=== EVENTS ===');
  const events = await db.collection('events').get();
  console.log('Total events:', events.size);
  events.docs.forEach(doc => {
    const d = doc.data();
    console.log('Event:', doc.id);
    console.log('  Title:', d.title);
    console.log('  OrganizerId:', d.organizerId);
    console.log('  OrganizerName:', d.organizerName);
    console.log('');
  });
  
  console.log('=== USERS ===');
  const users = await db.collection('users').get();
  console.log('Total users:', users.size);
  users.docs.forEach(doc => {
    const d = doc.data();
    console.log('User:', doc.id);
    console.log('  Email:', d.email);
    console.log('  Name:', d.name);
    console.log('');
  });
  
  console.log('=== PROVIDERS ===');
  const providers = await db.collection('providers').get();
  console.log('Total providers:', providers.size);
  providers.docs.forEach(doc => {
    const d = doc.data();
    console.log('Provider:', doc.id);
    console.log('  UserId:', d.userId);
    console.log('  BusinessName:', d.businessName);
    console.log('');
  });
  
  process.exit(0);
}

investigate().catch(e => { console.error(e); process.exit(1); });
