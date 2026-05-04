/**
 * Test script to trigger a nearby event notification
 * Run with: node test_nearby_event.js <userId>
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function createTestEvent(userId) {
  try {
    console.log(`\n🔍 Fetching user data for: ${userId}`);
    
    // 1) Get user's location and FCM token
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.error('❌ User not found!');
      process.exit(1);
    }
    
    const userData = userDoc.data();
    const userLocation = userData.location;
    const fcmToken = userData.fcmToken;
    const localEventsEnabled = userData.notif_local_events ?? true;
    
    console.log('📍 User location:', userLocation);
    console.log('🔔 FCM token:', fcmToken ? '✅ Present' : '❌ Missing');
    console.log('⚙️  Local events enabled:', localEventsEnabled);
    
    if (!userLocation) {
      console.error('❌ User has no location set. Please set location in the app first.');
      process.exit(1);
    }
    
    if (!fcmToken) {
      console.error('❌ User has no FCM token. Please open the app on your phone first.');
      process.exit(1);
    }
    
    // 2) Create event 5km away from user (well within 25km radius)
    const eventLocation = {
      lat: userLocation.lat + 0.045, // ~5km north
      lng: userLocation.lng + 0.045, // ~5km east
      address: 'Test Event Location'
    };
    
    // 3) Create event document - this will trigger onLocalEventCreate
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 7); // 1 week from now
    
    const eventData = {
      name: '🚴 Weekend Group Ride - TEST',
      date: admin.firestore.Timestamp.fromDate(eventDate),
      location: eventLocation,
      type: 'group_ride',
      description: 'This is a test event to verify notifications are working!',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    console.log('\n📝 Creating test event...');
    console.log('Event details:', {
      name: eventData.name,
      date: eventDate.toLocaleString(),
      location: eventLocation,
      type: eventData.type,
    });
    
    const eventRef = await db.collection('localEvents').add(eventData);
    
    console.log('\n✅ Test event created successfully!');
    console.log('📄 Event ID:', eventRef.id);
    console.log('\n⏳ Waiting for Cloud Function to process...');
    console.log('📱 You should receive a notification on your phone shortly!');
    console.log('\n💡 Check Firebase Console > Functions > Logs to see execution details');
    
    // Wait a few seconds then show event in console
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n📊 Event created in Firestore:');
    console.log(`https://console.firebase.google.com/project/cykel-32383/firestore/data/~2FlocalEvents~2F${eventRef.id}`);
    
  } catch (error) {
    console.error('\n❌ Error creating test event:', error);
    process.exit(1);
  }
}

// Get userId from command line
const userId = process.argv[2];

if (!userId) {
  console.error('❌ Usage: node test_nearby_event.js <userId>');
  console.error('Example: node test_nearby_event.js abc123xyz');
  process.exit(1);
}

createTestEvent(userId).then(() => {
  console.log('\n✅ Test complete!');
  process.exit(0);
});
