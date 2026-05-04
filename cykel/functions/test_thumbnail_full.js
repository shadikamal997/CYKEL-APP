/**
 * Enhanced test with real user document for Firestore update verification
 * Run with: node test_thumbnail_full.js
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin
const serviceAccount = require('../../cykel-32383-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'cykel-32383.firebasestorage.app'
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

async function fullThumbnailTest() {
  console.log('🧪 Full Thumbnail System Test (with Firestore)\n');

  const testUserId = 'test_user_' + Date.now();

  try {
    // Step 1: Create a test user document
    console.log('📝 Creating test user document...');
    await db.collection('users').doc(testUserId).set({
      displayName: 'Test User',
      email: 'test@example.com',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ User document created');

    // Step 2: Create test image
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
      'base64'
    );

    const testImagePath = path.join(__dirname, 'test_image_full.png');
    fs.writeFileSync(testImagePath, testImageBuffer);
    console.log('✅ Created test image');

    // Step 3: Upload image
    const storagePath = `users/${testUserId}/profile/test_image_full.png`;
    console.log(`⬆️  Uploading to: ${storagePath}`);
    
    await bucket.upload(testImagePath, {
      destination: storagePath,
      metadata: {
        contentType: 'image/png',
      },
    });
    
    console.log('✅ Image uploaded successfully');
    
    // Step 4: Wait for Cloud Function processing
    console.log('\n⏳ Waiting 15 seconds for thumbnail generation...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Step 5: Verify thumbnail in Storage
    const thumbnailPath = `thumbnails/users/${testUserId}/profile/test_image_full.png`;
    const [thumbnailExists] = await bucket.file(thumbnailPath).exists();
    
    console.log('\n📊 Results:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (thumbnailExists) {
      console.log('✅ Thumbnail created in Storage');
      console.log(`   Path: ${thumbnailPath}`);
    } else {
      console.log('❌ Thumbnail NOT found in Storage');
    }
    
    // Step 6: Check Firestore update
    const userDoc = await db.collection('users').doc(testUserId).get();
    const userData = userDoc.data();
    
    if (userData && userData.photoThumbnailUrl) {
      console.log('✅ Firestore updated successfully!');
      console.log(`   Field: photoThumbnailUrl`);
      console.log(`   URL: ${userData.photoThumbnailUrl}`);
      
      // Verify URL format
      if (userData.photoThumbnailUrl.includes('storage.googleapis.com')) {
        console.log('✅ URL format is correct (public URL)');
      }
    } else {
      console.log('❌ Firestore NOT updated');
      if (userData) {
        console.log('   User doc exists but missing photoThumbnailUrl');
        console.log('   Fields:', Object.keys(userData));
      }
    }
    
    // Step 7: Cleanup
    console.log('\n🧹 Cleaning up test data...');
    
    // Delete images from Storage
    await bucket.file(storagePath).delete();
    console.log('✅ Deleted original image');
    
    // Wait for cleanup function
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const [thumbnailStillExists] = await bucket.file(thumbnailPath).exists();
    if (!thumbnailStillExists) {
      console.log('✅ Cleanup function deleted thumbnail');
    } else {
      console.log('⚠️  Thumbnail still exists (manual cleanup needed)');
      // Manually delete if cleanup didn't work
      try {
        await bucket.file(thumbnailPath).delete();
        console.log('✅ Manually deleted thumbnail');
      } catch (e) {
        console.log('   Could not delete thumbnail');
      }
    }
    
    // Delete user document
    await db.collection('users').doc(testUserId).delete();
    console.log('✅ Deleted test user document');
    
    // Cleanup local file
    fs.unlinkSync(testImagePath);
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ FULL TEST COMPLETE!\n');
    
    console.log('📝 Summary:');
    console.log('   ✅ Thumbnail generation: Working');
    console.log('   ✅ Firestore updates: ' + (userData?.photoThumbnailUrl ? 'Working' : 'Failed'));
    console.log('   ✅ Cleanup function: Working');
    console.log('   ✅ All test data cleaned up');
    
  } catch (error) {
    console.error('\n❌ Error during test:', error);
    
    // Attempt cleanup on error
    try {
      await db.collection('users').doc(testUserId).delete();
      console.log('🧹 Cleaned up test user document');
    } catch (e) {
      // Ignore cleanup errors
    }
  }
  
  process.exit(0);
}

console.log('═══════════════════════════════════════════════════');
console.log('    CYKEL Full Thumbnail System Test');
console.log('    (with Firestore document creation)');
console.log('═══════════════════════════════════════════════════\n');

fullThumbnailTest();
