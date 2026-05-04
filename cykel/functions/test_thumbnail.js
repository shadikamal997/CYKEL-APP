/**
 * Test script to upload an image and trigger thumbnail generation
 * Run with: node test_thumbnail.js
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

async function testThumbnailGeneration() {
  console.log('🧪 Testing Thumbnail Generation\n');

  try {
    // Create a simple test image (1x1 pixel red PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
      'base64'
    );

    const testImagePath = path.join(__dirname, 'test_image.png');
    fs.writeFileSync(testImagePath, testImageBuffer);
    console.log('✅ Created test image');

    // Upload to Firebase Storage in a test user path
    const testUserId = 'test_user_' + Date.now();
    const storagePath = `users/${testUserId}/profile/test_image.png`;
    
    console.log(`⬆️  Uploading to: ${storagePath}`);
    
    await bucket.upload(testImagePath, {
      destination: storagePath,
      metadata: {
        contentType: 'image/png',
      },
    });
    
    console.log('✅ Image uploaded successfully');
    
    // Wait for Cloud Function to process (usually takes 5-10 seconds)
    console.log('\n⏳ Waiting 15 seconds for thumbnail generation...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Check if thumbnail was created
    const thumbnailPath = `thumbnails/users/${testUserId}/profile/test_image.png`;
    const [thumbnailExists] = await bucket.file(thumbnailPath).exists();
    
    if (thumbnailExists) {
      console.log('✅ Thumbnail created in Storage!');
      console.log(`   Path: ${thumbnailPath}`);
    } else {
      console.log('❌ Thumbnail NOT found in Storage');
    }
    
    // Check if Firestore was updated
    const userDoc = await db.collection('users').doc(testUserId).get();
    
    if (userDoc.exists && userDoc.data().photoThumbnailUrl) {
      console.log('✅ Firestore updated with thumbnail URL!');
      console.log(`   URL: ${userDoc.data().photoThumbnailUrl.substring(0, 80)}...`);
    } else {
      console.log('❌ Firestore NOT updated (user doc may not exist, which is expected for test)');
    }
    
    // Cleanup test files
    fs.unlinkSync(testImagePath);
    
    // Delete test image from Storage (this will trigger cleanupThumbnails)
    console.log('\n🧹 Testing cleanup function...');
    await bucket.file(storagePath).delete();
    console.log('✅ Deleted original image');
    
    // Wait for cleanup function
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const [thumbnailStillExists] = await bucket.file(thumbnailPath).exists();
    if (!thumbnailStillExists) {
      console.log('✅ Cleanup function deleted thumbnail!');
    } else {
      console.log('⚠️  Thumbnail still exists (cleanup may be delayed)');
    }
    
    console.log('\n✅ Test complete!\n');
    
    console.log('📝 Summary:');
    console.log('   - Thumbnail generation: ' + (thumbnailExists ? '✅ Working' : '❌ Failed'));
    console.log('   - Firestore updates: Check Firebase Console (test doc may not exist)');
    console.log('   - Cleanup function: ' + (!thumbnailStillExists ? '✅ Working' : '⚠️ Check logs'));
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
  
  process.exit(0);
}

console.log('═══════════════════════════════════════════════════');
console.log('    CYKEL Thumbnail System Test');
console.log('═══════════════════════════════════════════════════\n');

testThumbnailGeneration();
