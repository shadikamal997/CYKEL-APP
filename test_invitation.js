const admin = require('firebase-admin');
const serviceAccount = require('./cykel-32383-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function testInvitation() {
  console.log('🧪 Testing Family Invitation Email System...\n');

  // Replace these with real values for testing
  const TEST_FAMILY_ID = 'test-family-' + Date.now();
  const TEST_INVITER_NAME = 'Shadi (Test)';
  const TEST_RECIPIENT_EMAIL = 'shadikamal21@gmail.com'; // Your email to test
  const TEST_RECIPIENT_NAME = 'Test Recipient';

  console.log('📧 Sending invitation to:', TEST_RECIPIENT_EMAIL);
  console.log('👨‍👩‍👧 From:', TEST_INVITER_NAME);
  console.log('🆔 Family ID:', TEST_FAMILY_ID);
  console.log('');

  try {
    // Create the invitation document (this triggers the Cloud Function)
    const invitationRef = await db.collection('familyInvitations').add({
      familyId: TEST_FAMILY_ID,
      inviterName: TEST_INVITER_NAME,
      recipientEmail: TEST_RECIPIENT_EMAIL,
      recipientName: TEST_RECIPIENT_NAME,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending'
    });

    console.log('✅ Created invitation document:', invitationRef.id);
    console.log('');

    // Wait a moment for Cloud Function to trigger
    console.log('⏳ Waiting 5 seconds for Cloud Function to process...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check if mail document was created
    console.log('🔍 Checking mail collection for queued email...\n');
    
    // Get recent emails (last 10) and find ours
    const mailSnapshot = await db.collection('mail')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    if (mailSnapshot.empty) {
      console.log('❌ No email documents found in mail collection');
      console.log('⚠️  Cloud Function may not have triggered');
      return;
    }

    // Find our email by recipient
    let mailDoc = null;
    for (const doc of mailSnapshot.docs) {
      const data = doc.data();
      if (data.to === TEST_RECIPIENT_EMAIL || 
          (Array.isArray(data.to) && data.to.includes(TEST_RECIPIENT_EMAIL))) {
        mailDoc = doc;
        break;
      }
    }

    if (!mailDoc) {
      console.log('❌ No email document found for', TEST_RECIPIENT_EMAIL);
      console.log('⚠️  Cloud Function may not have triggered');
      console.log('📋 Recent emails:', mailSnapshot.docs.map(d => ({to: d.data().to})));
      return;
    }

    const mailData = mailDoc.data();

    console.log('✅ Found email document:', mailDoc.id);
    console.log('');
    console.log('📋 Email Details:');
    console.log('   To:', mailData.to);
    console.log('   Subject:', mailData.message?.subject);
    console.log('   Delivery State:', mailData.delivery?.state || 'PENDING');
    console.log('   Created:', mailData.createdAt?.toDate());
    console.log('');

    // Monitor delivery status
    console.log('👀 Monitoring delivery status for 30 seconds...\n');
    
    let attempts = 0;
    const maxAttempts = 15; // 30 seconds total
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedDoc = await db.collection('mail').doc(mailDoc.id).get();
      const updatedData = updatedDoc.data();
      const state = updatedData.delivery?.state;
      
      attempts++;
      
      if (state === 'SUCCESS') {
        console.log('✅ EMAIL DELIVERED SUCCESSFULLY!');
        console.log('');
        console.log('📊 Delivery Info:');
        console.log('   State:', state);
        console.log('   Attempts:', updatedData.delivery?.attempts);
        console.log('   Start Time:', updatedData.delivery?.startTime?.toDate());
        console.log('   End Time:', updatedData.delivery?.endTime?.toDate());
        console.log('   Info:', JSON.stringify(updatedData.delivery?.info, null, 2));
        console.log('');
        console.log('🎉 TEST PASSED! Check your inbox at', TEST_RECIPIENT_EMAIL);
        return;
      } else if (state === 'ERROR') {
        console.log('❌ EMAIL DELIVERY FAILED');
        console.log('');
        console.log('📊 Error Info:');
        console.log('   State:', state);
        console.log('   Error:', JSON.stringify(updatedData.delivery?.error, null, 2));
        return;
      } else if (state === 'PROCESSING') {
        process.stdout.write(`   ⏳ Processing... (${attempts}/${maxAttempts})\r`);
      } else {
        process.stdout.write(`   ⏳ Pending... (${attempts}/${maxAttempts})\r`);
      }
    }
    
    console.log('\n\n⚠️  Timeout: Email still processing after 30 seconds');
    console.log('💡 Check Firebase Console or run:');
    console.log('   firebase functions:log --only ext-firestore-send-email-processQueue');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testInvitation()
  .then(() => {
    console.log('\n✅ Test completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
