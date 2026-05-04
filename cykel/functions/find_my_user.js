/**
 * Find your user ID from Firestore
 * Run with: npm run find-user <email>
 */

const admin = require('firebase-admin');

// Check if already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

async function findUser(identifier) {
  try {
    console.log(`\n🔍 Searching for user: ${identifier}\n`);
    
    // Try to find by email first
    let userSnapshot = await db.collection('users')
      .where('email', '==', identifier.toLowerCase())
      .limit(1)
      .get();
    
    if (userSnapshot.empty) {
      // Try by displayName
      userSnapshot = await db.collection('users')
        .where('displayName', '==', identifier)
        .limit(1)
        .get();
    }
    
    if (userSnapshot.empty) {
      console.log('❌ User not found. Try searching by email or display name.');
      console.log('\n💡 Recent users:');
      
      // Show last 5 users
      const recentUsers = await db.collection('users')
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();
      
      recentUsers.forEach(doc => {
        const data = doc.data();
        console.log(`  • ${data.displayName || 'No name'} (${data.email || 'No email'}) - ID: ${doc.id}`);
      });
      
      return;
    }
    
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('✅ User found!\n');
    console.log('═'.repeat(50));
    console.log('👤 User ID:', userDoc.id);
    console.log('📧 Email:', userData.email || 'N/A');
    console.log('📝 Display Name:', userData.displayName || 'N/A');
    console.log('📍 Location:', userData.location ? '✅ Set' : '❌ Not set');
    console.log('🔔 FCM Token:', userData.fcmToken ? '✅ Present' : '❌ Missing');
    console.log('═'.repeat(50));
    
    if (userData.location) {
      console.log('\n📍 Location details:');
      console.log('  Lat:', userData.location.lat);
      console.log('  Lng:', userData.location.lng);
    }
    
    console.log('\n📊 Notification Preferences:');
    console.log('  Local Events:', userData.notif_local_events ?? true ? '✅ Enabled' : '❌ Disabled');
    console.log('  Weather:', userData.notif_weather_alerts ?? true ? '✅ Enabled' : '❌ Disabled');
    console.log('  Ride Stats:', userData.notif_ride_stats ?? true ? '✅ Enabled' : '❌ Disabled');
    console.log('  Milestones:', userData.notif_milestones ?? true ? '✅ Enabled' : '❌ Disabled');
    
    console.log('\n💡 To test nearby event notification, run:');
    console.log(`   cd functions && node test_nearby_event.js ${userDoc.id}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

const identifier = process.argv[2];

if (!identifier) {
  console.error('❌ Usage: node find_my_user.js <email-or-name>');
  console.error('Example: node find_my_user.js user@example.com');
  process.exit(1);
}

findUser(identifier).then(() => process.exit(0));
