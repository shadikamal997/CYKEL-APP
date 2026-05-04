/**
 * CRITICAL MIGRATION SCRIPT
 * 
 * MUST RUN BEFORE deploying new Firestore rules!
 * 
 * This script adds the `participantIds` array to existing events.
 * The new security rules require this field to restrict event chat
 * access to participants only.
 * 
 * WITHOUT THIS MIGRATION:
 * - Event participants won't be able to read chat messages
 * - Event organizers will be locked out of their own events
 * - App will be broken for all event features
 */

const admin = require('firebase-admin');
const serviceAccount = require('./cykel-32383-firebase-adminsdk.json');

// Check if Firebase is already initialized (from previous migration script)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function migrateEvents() {
  console.log('🔄 Starting events migration...');
  console.log('Adding participantIds field to existing events\n');
  
  try {
    const eventsSnapshot = await db.collection('events').get();
    
    if (eventsSnapshot.empty) {
      console.log('✅ No events found - migration not needed');
      return;
    }
    
    console.log(`Found ${eventsSnapshot.size} events to migrate\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const doc of eventsSnapshot.docs) {
      const data = doc.data();
      const eventId = doc.id;
      
      try {
        // Check if participantIds already exists
        if (data.participantIds && Array.isArray(data.participantIds)) {
          console.log(`⏭️  Skipping ${eventId} - already has participantIds`);
          successCount++;
          continue;
        }
        
        // Initialize participantIds with the organizer
        const participantIds = [data.organizerId];
        
        // Add any participants from the participants subcollection
        const participantsSnapshot = await doc.ref.collection('participants').get();
        
        participantsSnapshot.docs.forEach(participantDoc => {
          const participantId = participantDoc.id;
          if (!participantIds.includes(participantId)) {
            participantIds.push(participantId);
          }
        });
        
        // Update the event
        await doc.ref.update({
          participantIds: participantIds,
          migratedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        console.log(`✅ Migrated event ${eventId}:`);
        console.log(`   Title: ${data.title}`);
        console.log(`   Organizer: ${data.organizerId}`);
        console.log(`   Total participants: ${participantIds.length}`);
        console.log(`   Participants: ${participantIds.join(', ')}\n`);
        
        successCount++;
      } catch (error) {
        console.error(`❌ Error migrating event ${eventId}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('MIGRATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`✅ Success: ${successCount} events`);
    console.log(`❌ Errors: ${errorCount} events`);
    console.log(`📊 Total: ${eventsSnapshot.size} events`);
    
    if (errorCount > 0) {
      console.log('\n⚠️  Some events failed to migrate. Review errors above.');
      process.exit(1);
    } else {
      console.log('\n🎉 All events migrated successfully!');
      console.log('✅ Safe to deploy new Firestore rules');
    }
    
  } catch (error) {
    console.error('💥 FATAL ERROR during migration:', error);
    process.exit(1);
  }
}

// Run migration
migrateEvents()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
