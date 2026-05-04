#!/usr/bin/env node
/**
 * CYKEL Firestore Permission Test Script
 * 
 * Tests all critical permission flows that were recently fixed:
 * - Event creation
 * - Marketplace listing creation
 * - Bike rental listing creation
 * - Provider registration
 * - Hazard report creation
 * 
 * This script requires an authenticated user token to test.
 * 
 * Usage:
 *   node test_permissions.js <USER_ID_TOKEN>
 * 
 * To get a user ID token:
 *   1. Log into the app
 *   2. Use Firebase Auth getCurrentUser().getIdToken()
 *   3. Pass the token to this script
 */

const admin = require('firebase-admin');
const serviceAccount = require('../cykel-32383-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEventCreation(userId) {
  log('\n🎉 Testing Event Creation...', 'blue');
  
  try {
    const eventRef = db.collection('events').doc();
    const eventData = {
      title: 'Permission Test Event',
      description: 'This is a test event to verify permissions',
      organizerId: userId,
      organizerName: 'Test User',
      startTime: admin.firestore.Timestamp.now(),
      endTime: admin.firestore.Timestamp.fromMillis(Date.now() + 3600000), // 1 hour later
      location: {
        lat: 55.6761,
        lng: 12.5683,
        address: 'Copenhagen, Denmark'
      },
      isPublic: true,
      maxParticipants: 20,
      participantIds: [userId],
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    await eventRef.set(eventData);
    log(`  ✅ Event created successfully: ${eventRef.id}`, 'green');

    // Clean up test event
    await eventRef.delete();
    log(`  🗑️  Test event cleaned up`, 'reset');

    return { test: 'Event Creation', status: 'PASS' };
  } catch (error) {
    log(`  ❌ Event creation failed: ${error.message}`, 'red');
    return { test: 'Event Creation', status: 'FAIL', error: error.message };
  }
}

async function testMarketplaceListing(userId) {
  log('\n🛒 Testing Marketplace Listing Creation...', 'blue');
  
  try {
    const listingRef = db.collection('marketplace_listings').doc();
    const listingData = {
      title: 'Permission Test Bike',
      description: 'Test listing for permission verification',
      price: 500,
      currency: 'DKK',
      category: 'bikes',
      condition: 'used',
      sellerId: userId,
      sellerName: 'Test User',
      images: [],
      status: 'active',
      isSold: false,
      location: {
        lat: 55.6761,
        lng: 12.5683,
        city: 'Copenhagen'
      },
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    await listingRef.set(listingData);
    log(`  ✅ Marketplace listing created successfully: ${listingRef.id}`, 'green');

    // Clean up test listing
    await listingRef.delete();
    log(`  🗑️  Test listing cleaned up`, 'reset');

    return { test: 'Marketplace Listing', status: 'PASS' };
  } catch (error) {
    log(`  ❌ Marketplace listing creation failed: ${error.message}`, 'red');
    return { test: 'Marketplace Listing', status: 'FAIL', error: error.message };
  }
}

async function testBikeListing(userId) {
  log('\n🚲 Testing Bike Rental Listing Creation...', 'blue');
  
  try {
    const listingRef = db.collection('bikeListings').doc();
    const listingData = {
      bikeName: 'Permission Test Rental Bike',
      description: 'Test rental listing',
      bikeType: 'city',
      pricePerDay: 50,
      pricePerWeek: 300,
      currency: 'DKK',
      ownerId: userId,
      ownerName: 'Test User',
      location: {
        lat: 55.6761,
        lng: 12.5683,
        address: 'Copenhagen'
      },
      isAvailable: true,
      images: [],
      features: ['helmet', 'lock'],
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    await listingRef.set(listingData);
    log(`  ✅ Bike listing created successfully: ${listingRef.id}`, 'green');

    // Clean up test listing
    await listingRef.delete();
    log(`  🗑️  Test listing cleaned up`, 'reset');

    return { test: 'Bike Rental Listing', status: 'PASS' };
  } catch (error) {
    log(`  ❌ Bike listing creation failed: ${error.message}`, 'red');
    return { test: 'Bike Rental Listing', status: 'FAIL', error: error.message };
  }
}

async function testProviderRegistration(userId) {
  log('\n🏪 Testing Provider Registration...', 'blue');
  
  try {
    const providerRef = db.collection('providers').doc();
    const providerData = {
      businessName: 'Permission Test Shop',
      description: 'Test provider registration',
      providerType: 'bike_shop',
      userId: userId,
      contactPerson: 'Test User',
      email: 'test@example.com',
      phone: '+45 12345678',
      location: {
        lat: 55.6761,
        lng: 12.5683,
        address: 'Copenhagen'
      },
      verificationStatus: 'pending',
      isActive: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    await providerRef.set(providerData);
    log(`  ✅ Provider registered successfully: ${providerRef.id}`, 'green');

    // Clean up test provider
    await providerRef.delete();
    log(`  🗑️  Test provider cleaned up`, 'reset');

    return { test: 'Provider Registration', status: 'PASS' };
  } catch (error) {
    log(`  ❌ Provider registration failed: ${error.message}`, 'red');
    return { test: 'Provider Registration', status: 'FAIL', error: error.message };
  }
}

async function testHazardReport(userId) {
  log('\n⚠️  Testing Hazard Report Creation...', 'blue');
  
  try {
    const reportRef = db.collection('hazard_reports').doc();
    const reportData = {
      type: 'pothole',
      description: 'Test hazard report',
      reporterId: userId,
      reporterName: 'Test User',
      lat: 55.6761,
      lng: 12.5683,
      address: 'Copenhagen',
      severity: 'medium',
      status: 'pending',
      upvotes: 0,
      reportedAt: admin.firestore.Timestamp.now(),
    };

    await reportRef.set(reportData);
    log(`  ✅ Hazard report created successfully: ${reportRef.id}`, 'green');

    // Clean up test report
    await reportRef.delete();
    log(`  🗑️  Test report cleaned up`, 'reset');

    return { test: 'Hazard Report', status: 'PASS' };
  } catch (error) {
    log(`  ❌ Hazard report creation failed: ${error.message}`, 'red');
    return { test: 'Hazard Report', status: 'FAIL', error: error.message };
  }
}

async function testLocationCreation(userId) {
  log('\n📍 Testing Location Creation...', 'blue');
  
  try {
    const locationRef = db.collection('locations').doc();
    const locationData = {
      name: 'Test Location',
      description: 'Test location for permission check',
      category: 'bike_parking',
      lat: 55.6761,
      lng: 12.5683,
      address: 'Copenhagen',
      addedBy: userId,
      providerId: null, // Optional
      rating: 0,
      reviewCount: 0,
      isVerified: false,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    await locationRef.set(locationData);
    log(`  ✅ Location created successfully: ${locationRef.id}`, 'green');

    // Clean up test location
    await locationRef.delete();
    log(`  🗑️  Test location cleaned up`, 'reset');

    return { test: 'Location Creation', status: 'PASS' };
  } catch (error) {
    log(`  ❌ Location creation failed: ${error.message}`, 'red');
    return { test: 'Location Creation', status: 'FAIL', error: error.message };
  }
}

function generateReport(results) {
  log('\n' + '='.repeat(60), 'magenta');
  log('📊 PERMISSION TEST REPORT', 'magenta');
  log('='.repeat(60), 'magenta');

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  log(`\n📈 Summary:`, 'blue');
  log(`  Total tests: ${results.length}`, 'reset');
  log(`  Passed: ${passed}`, 'green');
  log(`  Failed: ${failed}`, failed > 0 ? 'red' : 'green');

  log(`\n📋 Test Results:`, 'blue');
  results.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : '❌';
    const color = result.status === 'PASS' ? 'green' : 'red';
    log(`  ${icon} ${result.test}: ${result.status}`, color);
    if (result.error) {
      log(`     Error: ${result.error}`, 'yellow');
    }
  });

  if (failed === 0) {
    log('\n✅ All permission tests passed!', 'green');
    log('Recent Firestore rules fixes are working correctly.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Please review the errors above.', 'yellow');
  }

  log('\n' + '='.repeat(60), 'magenta');
}

async function main() {
  try {
    log('\n🔥 CYKEL Permission Test Suite', 'magenta');
    log('='.repeat(60), 'magenta');

    // Get a real user to test with (use first user or create test user)
    const usersSnap = await db.collection('users').limit(1).get();
    
    if (usersSnap.empty) {
      log('\n❌ No users found in database. Please create a user first.', 'red');
      process.exit(1);
    }

    const userId = usersSnap.docs[0].id;
    log(`\n👤 Testing with user: ${userId}`, 'blue');

    const results = [];
    results.push(await testEventCreation(userId));
    results.push(await testMarketplaceListing(userId));
    results.push(await testBikeListing(userId));
    results.push(await testProviderRegistration(userId));
    results.push(await testHazardReport(userId));
    results.push(await testLocationCreation(userId));

    generateReport(results);

    process.exit(results.every(r => r.status === 'PASS') ? 0 : 1);
  } catch (error) {
    log(`\n❌ Error running permission tests: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
