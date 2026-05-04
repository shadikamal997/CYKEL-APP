/**
 * CYKEL - Thumbnail Generation Cloud Function
 * Automatically generates thumbnails when images are uploaded to Firebase Storage
 * 
 * Deployment:
 *   firebase deploy --only functions:generateThumbnail
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Initialize if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const storage = new Storage();

// Configuration
const THUMBNAIL_SIZES = {
  small: 300,   // Default thumbnail size
  medium: 600,  // For higher quality needs
};

const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

/**
 * Generate thumbnails when an image is uploaded to Firebase Storage
 * Supports: User photos, event images, marketplace listings, provider photos
 */
exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const contentType = object.contentType;
  const bucket = storage.bucket(object.bucket);

  console.log(`Processing file: ${filePath}`);

  // 1. Exit if not an image
  if (!contentType || !SUPPORTED_TYPES.includes(contentType)) {
    console.log(`Not a supported image type: ${contentType}`);
    return null;
  }

  // 2. Exit if already a thumbnail
  if (filePath.includes('/thumbnails/') || filePath.includes('_thumb')) {
    console.log('Already a thumbnail, skipping');
    return null;
  }

  // 3. Exit if in excluded paths
  const excludedPaths = ['temp/', 'cache/', '.appcheck/'];
  if (excludedPaths.some(excluded => filePath.startsWith(excluded))) {
    console.log('Excluded path, skipping');
    return null;
  }

  // 4. Parse file path
  const fileName = path.basename(filePath);
  const fileDir = path.dirname(filePath);
  const fileExtension = path.extname(fileName);
  const fileNameWithoutExt = path.basename(fileName, fileExtension);

  // 5. Set thumbnail paths
  const thumbnailDir = `${fileDir}/thumbnails`;
  const thumbnailFileName = `${fileNameWithoutExt}_thumb${fileExtension}`;
  const thumbnailPath = `${thumbnailDir}/${thumbnailFileName}`;

  // 6. Download original image
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const tempThumbnailPath = path.join(os.tmpdir(), thumbnailFileName);

  try {
    await bucket.file(filePath).download({ destination: tempFilePath });
    console.log(`Downloaded ${filePath} to ${tempFilePath}`);

    // 7. Generate thumbnail using Sharp
    await sharp(tempFilePath)
      .resize(THUMBNAIL_SIZES.small, THUMBNAIL_SIZES.small, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85, progressive: true })
      .toFile(tempThumbnailPath);

    console.log(`Thumbnail created at ${tempThumbnailPath}`);

    // 8. Upload thumbnail to Storage
    await bucket.upload(tempThumbnailPath, {
      destination: thumbnailPath,
      metadata: {
        contentType: 'image/jpeg',
        metadata: {
          originalFile: filePath,
          thumbnailSize: THUMBNAIL_SIZES.small,
          generatedAt: new Date().toISOString(),
        },
      },
    });

    console.log(`Thumbnail uploaded to ${thumbnailPath}`);

    // 9. Get public URL
    const thumbnailFile = bucket.file(thumbnailPath);
    const [thumbnailUrl] = await thumbnailFile.getSignedUrl({
      action: 'read',
      expires: '01-01-2100', // Far future expiry
    });

    // 10. Update Firestore document with thumbnail URL
    await updateFirestoreWithThumbnail(filePath, thumbnailUrl);

    // 11. Cleanup temp files
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(tempThumbnailPath);

    console.log('✅ Thumbnail generation complete');
    return { thumbnailPath, thumbnailUrl };

  } catch (error) {
    console.error('❌ Error generating thumbnail:', error);
    
    // Cleanup on error
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    if (fs.existsSync(tempThumbnailPath)) fs.unlinkSync(tempThumbnailPath);
    
    throw error;
  }
});

/**
 * Update Firestore documents with thumbnail URL
 * Handles different document types based on file path
 */
async function updateFirestoreWithThumbnail(filePath, thumbnailUrl) {
  const db = admin.firestore();

  try {
    // Determine document type from path and update accordingly
    
    // User photos: users/{userId}/photoUrl
    if (filePath.startsWith('users/') && filePath.includes('/profile/')) {
      const userId = filePath.split('/')[1];
      await db.collection('users').doc(userId).update({
        photoThumbnailUrl: thumbnailUrl,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Updated user ${userId} with thumbnail`);
    }
    
    // Event images: events/{eventId}/images/
    else if (filePath.startsWith('events/')) {
      const pathParts = filePath.split('/');
      const eventId = pathParts[1];
      await db.collection('events').doc(eventId).update({
        imageThumbnailUrl: thumbnailUrl,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Updated event ${eventId} with thumbnail`);
    }
    
    // Marketplace listings: marketplace/{listingId}/images/
    else if (filePath.startsWith('marketplace/')) {
      const pathParts = filePath.split('/');
      const listingId = pathParts[1];
      
      // Get current listing to update thumbnail array
      const listingRef = db.collection('marketplace_listings').doc(listingId);
      const listing = await listingRef.get();
      
      if (listing.exists) {
        const currentThumbnails = listing.data().thumbnailUrls || [];
        currentThumbnails.push(thumbnailUrl);
        
        await listingRef.update({
          thumbnailUrls: currentThumbnails,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Updated marketplace listing ${listingId} with thumbnail`);
      }
    }
    
    // Provider photos: providers/{providerId}/photos/
    else if (filePath.startsWith('providers/')) {
      const pathParts = filePath.split('/');
      const providerId = pathParts[1];
      
      const providerRef = db.collection('providers').doc(providerId);
      const provider = await providerRef.get();
      
      if (provider.exists) {
        // Check if this is the cover photo
        if (filePath.includes('cover')) {
          await providerRef.update({
            coverPhotoThumbnailUrl: thumbnailUrl,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          // Add to photo thumbnails array
          const currentThumbnails = provider.data().photoThumbnailUrls || [];
          currentThumbnails.push(thumbnailUrl);
          
          await providerRef.update({
            photoThumbnailUrls: currentThumbnails,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
        console.log(`Updated provider ${providerId} with thumbnail`);
      }
    }
    
    // Bike rental listings: bike_rentals/{listingId}/images/
    else if (filePath.startsWith('bike_rentals/')) {
      const pathParts = filePath.split('/');
      const listingId = pathParts[1];
      
      const listingRef = db.collection('bike_listings').doc(listingId);
      const listing = await listingRef.get();
      
      if (listing.exists) {
        const currentThumbnails = listing.data().thumbnailUrls || [];
        currentThumbnails.push(thumbnailUrl);
        
        await listingRef.update({
          thumbnailUrls: currentThumbnails,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Updated bike rental ${listingId} with thumbnail`);
      }
    }
    
    else {
      console.log(`No Firestore update logic for path: ${filePath}`);
    }
    
  } catch (error) {
    console.error('Error updating Firestore:', error);
    // Don't throw - thumbnail was created successfully even if Firestore update failed
  }
}

/**
 * Optional: Clean up thumbnails when original image is deleted
 */
exports.cleanupThumbnails = functions.storage.object().onDelete(async (object) => {
  const filePath = object.name;
  
  // Skip if already a thumbnail
  if (filePath.includes('/thumbnails/')) {
    return null;
  }
  
  // Construct thumbnail path
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const fileExtension = path.extname(fileName);
  const fileNameWithoutExt = path.basename(fileName, fileExtension);
  const thumbnailPath = `${fileDir}/thumbnails/${fileNameWithoutExt}_thumb${fileExtension}`;
  
  const bucket = storage.bucket(object.bucket);
  
  try {
    await bucket.file(thumbnailPath).delete();
    console.log(`✅ Deleted thumbnail: ${thumbnailPath}`);
  } catch (error) {
    if (error.code === 404) {
      console.log('Thumbnail not found, nothing to delete');
    } else {
      console.error('Error deleting thumbnail:', error);
    }
  }
  
  return null;
});
