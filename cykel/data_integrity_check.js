#!/usr/bin/env node
/**
 * CYKEL Data Integrity Check Script
 * 
 * Verifies:
 * - Orphaned documents (missing foreign keys)
 * - Invalid user references
 * - Broken relationships between collections
 * - Duplicate data
 * - Missing required fields
 * 
 * Usage:
 *   node data_integrity_check.js
 * 
 * Requires:
 *   - Firebase Admin SDK credentials (cykel-32383-firebase-adminsdk.json)
 *   - Node.js 18+
 */

const admin = require('firebase-admin');
const serviceAccount = require('../cykel-32383-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Color codes for console output
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

async function getAllUsers() {
  log('\n📋 Fetching all users...', 'blue');
  const usersSnap = await db.collection('users').get();
  const userIds = new Set(usersSnap.docs.map(doc => doc.id));
  log(`✅ Found ${userIds.size} users`, 'green');
  return userIds;
}

async function checkEvents(userIds) {
  log('\n🎉 Checking Events...', 'blue');
  const eventsSnap = await db.collection('events').get();
  let orphaned = 0;
  let missingFields = 0;
  const issues = [];

  for (const doc of eventsSnap.docs) {
    const data = doc.data();
    
    // Check organizerId exists
    if (!data.organizerId) {
      missingFields++;
      issues.push({ id: doc.id, issue: 'Missing organizerId' });
    } else if (!userIds.has(data.organizerId)) {
      orphaned++;
      issues.push({ id: doc.id, issue: `Orphaned: organizerId ${data.organizerId} not found` });
    }

    // Check required fields
    if (!data.title || !data.createdAt) {
      missingFields++;
      issues.push({ id: doc.id, issue: 'Missing required fields (title or createdAt)' });
    }
  }

  log(`  Total events: ${eventsSnap.size}`, 'reset');
  log(`  Orphaned events: ${orphaned}`, orphaned > 0 ? 'red' : 'green');
  log(`  Missing required fields: ${missingFields}`, missingFields > 0 ? 'yellow' : 'green');
  
  if (issues.length > 0) {
    log(`  Issues found:`, 'yellow');
    issues.forEach(issue => log(`    - ${issue.id}: ${issue.issue}`, 'yellow'));
  }

  return { collection: 'events', total: eventsSnap.size, orphaned, missingFields, issues };
}

async function checkMarketplace(userIds) {
  log('\n🛒 Checking Marketplace Listings...', 'blue');
  const listingsSnap = await db.collection('marketplace_listings').get();
  let orphaned = 0;
  let missingFields = 0;
  const issues = [];

  for (const doc of listingsSnap.docs) {
    const data = doc.data();
    
    // Check sellerId exists
    if (!data.sellerId) {
      missingFields++;
      issues.push({ id: doc.id, issue: 'Missing sellerId' });
    } else if (!userIds.has(data.sellerId)) {
      orphaned++;
      issues.push({ id: doc.id, issue: `Orphaned: sellerId ${data.sellerId} not found` });
    }

    // Check required fields
    if (!data.title || !data.price || !data.category) {
      missingFields++;
      issues.push({ id: doc.id, issue: 'Missing required fields (title, price, or category)' });
    }
  }

  log(`  Total listings: ${listingsSnap.size}`, 'reset');
  log(`  Orphaned listings: ${orphaned}`, orphaned > 0 ? 'red' : 'green');
  log(`  Missing required fields: ${missingFields}`, missingFields > 0 ? 'yellow' : 'green');
  
  if (issues.length > 0) {
    log(`  Issues found:`, 'yellow');
    issues.forEach(issue => log(`    - ${issue.id}: ${issue.issue}`, 'yellow'));
  }

  return { collection: 'marketplace_listings', total: listingsSnap.size, orphaned, missingFields, issues };
}

async function checkProviders(userIds) {
  log('\n🏪 Checking Providers...', 'blue');
  const providersSnap = await db.collection('providers').get();
  let orphaned = 0;
  let missingFields = 0;
  const issues = [];

  for (const doc of providersSnap.docs) {
    const data = doc.data();
    
    // Check userId exists
    if (!data.userId) {
      missingFields++;
      issues.push({ id: doc.id, issue: 'Missing userId' });
    } else if (!userIds.has(data.userId)) {
      orphaned++;
      issues.push({ id: doc.id, issue: `Orphaned: userId ${data.userId} not found` });
    }

    // Check required fields
    if (!data.providerType || !data.businessName) {
      missingFields++;
      issues.push({ id: doc.id, issue: 'Missing required fields (providerType or businessName)' });
    }
  }

  log(`  Total providers: ${providersSnap.size}`, 'reset');
  log(`  Orphaned providers: ${orphaned}`, orphaned > 0 ? 'red' : 'green');
  log(`  Missing required fields: ${missingFields}`, missingFields > 0 ? 'yellow' : 'green');
  
  if (issues.length > 0) {
    log(`  Issues found:`, 'yellow');
    issues.forEach(issue => log(`    - ${issue.id}: ${issue.issue}`, 'yellow'));
  }

  return { collection: 'providers', total: providersSnap.size, orphaned, missingFields, issues };
}

async function checkBikeListings(userIds) {
  log('\n🚲 Checking Bike Listings...', 'blue');
  const listingsSnap = await db.collection('bikeListings').get();
  let orphaned = 0;
  let missingFields = 0;
  const issues = [];

  for (const doc of listingsSnap.docs) {
    const data = doc.data();
    
    // Check ownerId exists
    if (!data.ownerId) {
      missingFields++;
      issues.push({ id: doc.id, issue: 'Missing ownerId' });
    } else if (!userIds.has(data.ownerId)) {
      orphaned++;
      issues.push({ id: doc.id, issue: `Orphaned: ownerId ${data.ownerId} not found` });
    }

    // Check required fields
    if (!data.bikeName || data.pricePerDay === undefined) {
      missingFields++;
      issues.push({ id: doc.id, issue: 'Missing required fields (bikeName or pricePerDay)' });
    }
  }

  log(`  Total bike listings: ${listingsSnap.size}`, 'reset');
  log(`  Orphaned listings: ${orphaned}`, orphaned > 0 ? 'red' : 'green');
  log(`  Missing required fields: ${missingFields}`, missingFields > 0 ? 'yellow' : 'green');
  
  if (issues.length > 0) {
    log(`  Issues found:`, 'yellow');
    issues.forEach(issue => log(`    - ${issue.id}: ${issue.issue}`, 'yellow'));
  }

  return { collection: 'bikeListings', total: listingsSnap.size, orphaned, missingFields, issues };
}

async function checkConversations(userIds) {
  log('\n💬 Checking Conversations...', 'blue');
  const conversationsSnap = await db.collection('conversations').get();
  let orphaned = 0;
  let missingFields = 0;
  const issues = [];

  for (const doc of conversationsSnap.docs) {
    const data = doc.data();
    
    // Check participants exist
    if (!data.participants || !Array.isArray(data.participants)) {
      missingFields++;
      issues.push({ id: doc.id, issue: 'Missing or invalid participants array' });
    } else {
      for (const participantId of data.participants) {
        if (!userIds.has(participantId)) {
          orphaned++;
          issues.push({ id: doc.id, issue: `Orphaned: participant ${participantId} not found` });
          break; // Only report once per conversation
        }
      }
    }
  }

  log(`  Total conversations: ${conversationsSnap.size}`, 'reset');
  log(`  Orphaned conversations: ${orphaned}`, orphaned > 0 ? 'red' : 'green');
  log(`  Missing required fields: ${missingFields}`, missingFields > 0 ? 'yellow' : 'green');
  
  if (issues.length > 0) {
    log(`  Issues found:`, 'yellow');
    issues.forEach(issue => log(`    - ${issue.id}: ${issue.issue}`, 'yellow'));
  }

  return { collection: 'conversations', total: conversationsSnap.size, orphaned, missingFields, issues };
}

async function checkFriendships(userIds) {
  log('\n👥 Checking Friendships...', 'blue');
  const friendshipsSnap = await db.collection('friendships').get();
  let orphaned = 0;
  const issues = [];

  for (const doc of friendshipsSnap.docs) {
    const data = doc.data();
    
    // Check both users exist
    if (!data.user1 || !userIds.has(data.user1)) {
      orphaned++;
      issues.push({ id: doc.id, issue: `Orphaned: user1 ${data.user1} not found` });
    }
    
    if (!data.user2 || !userIds.has(data.user2)) {
      orphaned++;
      issues.push({ id: doc.id, issue: `Orphaned: user2 ${data.user2} not found` });
    }
  }

  log(`  Total friendships: ${friendshipsSnap.size}`, 'reset');
  log(`  Orphaned friendships: ${orphaned}`, orphaned > 0 ? 'red' : 'green');
  
  if (issues.length > 0) {
    log(`  Issues found:`, 'yellow');
    issues.forEach(issue => log(`    - ${issue.id}: ${issue.issue}`, 'yellow'));
  }

  return { collection: 'friendships', total: friendshipsSnap.size, orphaned, issues };
}

async function checkDuplicates() {
  log('\n🔍 Checking for Duplicates...', 'blue');
  
  // Check duplicate providers by userId
  const providersSnap = await db.collection('providers').get();
  const userIdCounts = new Map();
  
  providersSnap.docs.forEach(doc => {
    const userId = doc.data().userId;
    if (userId) {
      userIdCounts.set(userId, (userIdCounts.get(userId) || 0) + 1);
    }
  });

  const duplicates = Array.from(userIdCounts.entries()).filter(([_, count]) => count > 1);
  
  if (duplicates.length > 0) {
    log(`  ⚠️  Found ${duplicates.length} users with multiple provider accounts:`, 'yellow');
    duplicates.forEach(([userId, count]) => {
      log(`    - User ${userId}: ${count} providers`, 'yellow');
    });
  } else {
    log(`  ✅ No duplicate providers found`, 'green');
  }

  return { duplicateProviders: duplicates.length };
}

async function generateReport(results) {
  log('\n' + '='.repeat(60), 'magenta');
  log('📊 DATA INTEGRITY REPORT', 'magenta');
  log('='.repeat(60), 'magenta');

  let totalOrphaned = 0;
  let totalMissingFields = 0;
  let totalIssues = 0;

  results.forEach(result => {
    if (result.orphaned !== undefined) totalOrphaned += result.orphaned;
    if (result.missingFields !== undefined) totalMissingFields += result.missingFields;
    if (result.issues) totalIssues += result.issues.length;
  });

  log(`\n📈 Summary:`, 'blue');
  log(`  Total orphaned documents: ${totalOrphaned}`, totalOrphaned > 0 ? 'red' : 'green');
  log(`  Total missing required fields: ${totalMissingFields}`, totalMissingFields > 0 ? 'yellow' : 'green');
  log(`  Total issues found: ${totalIssues}`, totalIssues > 0 ? 'yellow' : 'green');

  if (totalIssues === 0) {
    log('\n✅ All data integrity checks passed!', 'green');
  } else {
    log('\n⚠️  Some issues were found. Please review the details above.', 'yellow');
  }

  log('\n' + '='.repeat(60), 'magenta');
}

async function main() {
  try {
    log('\n🔥 CYKEL Data Integrity Check', 'magenta');
    log('='.repeat(60), 'magenta');

    const userIds = await getAllUsers();

    const results = [];
    results.push(await checkEvents(userIds));
    results.push(await checkMarketplace(userIds));
    results.push(await checkProviders(userIds));
    results.push(await checkBikeListings(userIds));
    results.push(await checkConversations(userIds));
    results.push(await checkFriendships(userIds));
    results.push(await checkDuplicates());

    await generateReport(results);

    process.exit(0);
  } catch (error) {
    log(`\n❌ Error running integrity check: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
