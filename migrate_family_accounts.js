/**
 * CRITICAL MIGRATION SCRIPT
 * 
 * MUST RUN BEFORE deploying new Firestore rules!
 * 
 * This script adds the `memberIds` field to existing family accounts.
 * The new security rules require this field to restrict location data
 * access to family members only.
 * 
 * WITHOUT THIS MIGRATION:
 * - Existing family accounts will break (permission denied)
 * - Users won't be able to see family locations
 * - App will be unusable for family features
 */

const admin = require('firebase-admin');
const serviceAccount = require('./cykel-32383-firebase-adminsdk.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateFamilyAccounts() {
  console.log('🔄 Starting family accounts migration...');
  console.log('Adding memberIds field to existing family accounts\n');
  
  try {
    const familyAccountsSnapshot = await db.collection('familyAccounts').get();
    
    if (familyAccountsSnapshot.empty) {
      console.log('✅ No family accounts found - migration not needed');
      return;
    }
    
    console.log(`Found ${familyAccountsSnapshot.size} family accounts to migrate\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const doc of familyAccountsSnapshot.docs) {
      const data = doc.data();
      const accountId = doc.id;
      
      try {
        // Check if memberIds already exists
        if (data.memberIds && Array.isArray(data.memberIds)) {
          console.log(`⏭️  Skipping ${accountId} - already has memberIds`);
          successCount++;
          continue;
        }
        
        // Initialize memberIds with the owner
        const memberIds = [data.ownerId];
        
        // Add any existing members from invitations that were accepted
        const invitationsSnapshot = await db.collection('familyInvitations')
          .where('familyAccountId', '==', accountId)
          .where('status', '==', 'accepted')
          .get();
        
        invitationsSnapshot.docs.forEach(invitation => {
          const invitationData = invitation.data();
          if (invitationData.acceptedByUserId && !memberIds.includes(invitationData.acceptedByUserId)) {
            memberIds.push(invitationData.acceptedByUserId);
          }
        });
        
        // Update the family account
        await doc.ref.update({
          memberIds: memberIds,
          migratedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        console.log(`✅ Migrated ${accountId}:`);
        console.log(`   Owner: ${data.ownerId}`);
        console.log(`   Members: ${memberIds.join(', ')}`);
        console.log(`   Total members: ${memberIds.length}\n`);
        
        successCount++;
      } catch (error) {
        console.error(`❌ Error migrating ${accountId}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('MIGRATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`✅ Success: ${successCount} accounts`);
    console.log(`❌ Errors: ${errorCount} accounts`);
    console.log(`📊 Total: ${familyAccountsSnapshot.size} accounts`);
    
    if (errorCount > 0) {
      console.log('\n⚠️  Some accounts failed to migrate. Review errors above.');
      process.exit(1);
    } else {
      console.log('\n🎉 All family accounts migrated successfully!');
      console.log('✅ Safe to deploy new Firestore rules');
    }
    
  } catch (error) {
    console.error('💥 FATAL ERROR during migration:', error);
    process.exit(1);
  }
}

// Run migration
migrateFamilyAccounts()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
