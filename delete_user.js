// Quick script to manually delete a user account
const admin = require('firebase-admin');

// Initialize with your service account
const serviceAccount = require('./cykel/functions/.env.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = 'shadikamal21@gmail.com';

async function deleteUser() {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    console.log(`Found user: ${user.uid}`);
    
    // Delete all their data
    const db = admin.firestore();
    const storage = admin.storage();
    const uid = user.uid;
    
    console.log('Deleting Firestore data...');
    
    // Delete rides
    const ridesSnap = await db.collection('users').doc(uid).collection('rides').get();
    for (const doc of ridesSnap.docs) {
      await doc.ref.delete();
    }
    
    // Delete marketplace listings
    const listingsSnap = await db.collection('marketplace_listings').where('userId', '==', uid).get();
    for (const doc of listingsSnap.docs) {
      await doc.ref.delete();
    }
    
    // Delete marketplace photos
    const [marketplaceFiles] = await storage.bucket().getFiles({ prefix: `marketplace/${uid}/` });
    for (const file of marketplaceFiles) {
      await file.delete();
    }
    
    // Delete providers
    const providersSnap = await db.collection('providers').where('userId', '==', uid).get();
    const providerIds = providersSnap.docs.map(d => d.id);
    
    for (const providerId of providerIds) {
      // Delete provider_analytics
      await db.collection('provider_analytics').doc(providerId).delete();
      
      // Delete provider photos
      const [providerFiles] = await storage.bucket().getFiles({ prefix: `providers/${providerId}/` });
      for (const file of providerFiles) {
        await file.delete();
      }
    }
    
    // Delete provider docs
    for (const doc of providersSnap.docs) {
      await doc.ref.delete();
    }
    
    // Delete chats
    const chatsSnap = await db.collection('marketplace_chats').where('participants', 'array-contains', uid).get();
    for (const chatDoc of chatsSnap.docs) {
      const messagesSnap = await chatDoc.ref.collection('messages').get();
      for (const msg of messagesSnap.docs) {
        await msg.ref.delete();
      }
      await chatDoc.ref.delete();
    }
    
    // Delete user files
    const [userFiles] = await storage.bucket().getFiles({ prefix: `users/${uid}/` });
    for (const file of userFiles) {
      await file.delete();
    }
    
    // Delete user document
    await db.collection('users').doc(uid).delete();
    
    // Delete auth account
    await admin.auth().deleteUser(uid);
    
    console.log(`✅ Successfully deleted account for ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteUser();
