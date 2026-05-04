#!/usr/bin/env node
/**
 * CYKEL Geohash Migration Script
 * 
 * Adds geohash fields to existing Firestore documents
 * for efficient proximity queries
 * 
 * Collections to migrate:
 * - hazard_reports
 * - infrastructure_reports
 * - providers
 * - events
 * - expat_resources
 * - bike_rentals
 * - bike_share_stations
 * 
 * Usage:
 *   node migrate_geohash.js [collection_name]
 *   node migrate_geohash.js all
 */

const admin = require('firebase-admin');
const serviceAccount = require('./cykel-32383-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Calculate geohash from latitude/longitude
 * Uses base32 encoding with 9 character precision (~4.77m x 4.77m)
 */
function encodeGeohash(latitude, longitude, precision = 9) {
  const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
  let idx = 0;
  let bit = 0;
  let evenBit = true;
  let geohash = '';

  let latMin = -90, latMax = 90;
  let lonMin = -180, lonMax = 180;

  while (geohash.length < precision) {
    if (evenBit) {
      const lonMid = (lonMin + lonMax) / 2;
      if (longitude > lonMid) {
        idx = (idx << 1) + 1;
        lonMin = lonMid;
      } else {
        idx = idx << 1;
        lonMax = lonMid;
      }
    } else {
      const latMid = (latMin + latMax) / 2;
      if (latitude > latMid) {
        idx = (idx << 1) + 1;
        latMin = latMid;
      } else {
        idx = idx << 1;
        latMax = latMid;
      }
    }
    evenBit = !evenBit;

    if (++bit === 5) {
      geohash += BASE32[idx];
      bit = 0;
      idx = 0;
    }
  }

  return geohash;
}

/**
 * Migrate a single collection
 */
async function migrateCollection(collectionName, latField = 'lat', lngField = 'lng') {
  console.log(`\n🔄 Migrating collection: ${collectionName}`);
  
  const snapshot = await db.collection(collectionName).get();
  
  if (snapshot.empty) {
    console.log(`   ℹ️  Collection is empty, skipping...`);
    return;
  }

  console.log(`   Found ${snapshot.size} documents`);
  
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  const batch = db.batch();
  let batchCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    // Check if geohash already exists
    if (data.geohash) {
      skipped++;
      continue;
    }

    // Get lat/lng
    const lat = data[latField] ?? data.latitude;
    const lng = data[lngField] ?? data.longitude;

    if (lat == null || lng == null) {
      console.log(`   ⚠️  Document ${doc.id} missing coordinates`);
      errors++;
      continue;
    }

    // Calculate geohash
    const geohash = encodeGeohash(lat, lng);

    // Add to batch
    batch.update(doc.ref, {
      geohash: geohash,
      geo: {
        geopoint: new admin.firestore.GeoPoint(lat, lng),
        geohash: geohash
      },
      latitude: lat, // Ensure separate fields exist
      longitude: lng
    });

    updated++;
    batchCount++;

    // Commit batch when reaching 500 (Firestore limit)
    if (batchCount >= 500) {
      await batch.commit();
      console.log(`   ✅ Committed ${batchCount} updates`);
      batchCount = 0;
    }
  }

  // Commit remaining
  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`   ✅ Migration complete!`);
  console.log(`      Updated: ${updated}`);
  console.log(`      Skipped: ${skipped}`);
  console.log(`      Errors:  ${errors}`);
}

/**
 * Main migration
 */
async function main() {
  const arg = process.argv[2] || 'all';

  const collections = {
    hazard_reports: { lat: 'lat', lng: 'lng' },
    infrastructure_reports: { lat: 'lat', lng: 'lng' },
    providers: { lat: 'latitude', lng: 'longitude' },
    events: { lat: 'latitude', lng: 'longitude' },
    expat_resources: { lat: 'latitude', lng: 'longitude' },
    bike_rentals: { lat: 'latitude', lng: 'longitude' },
    bike_share_stations: { lat: 'latitude', lng: 'longitude' }
  };

  console.log('════════════════════════════════════════════════');
  console.log('  CYKEL Geohash Migration');
  console.log('  Project: cykel-32383');
  console.log('════════════════════════════════════════════════');

  try {
    if (arg === 'all') {
      for (const [collection, fields] of Object.entries(collections)) {
        await migrateCollection(collection, fields.lat, fields.lng);
      }
    } else if (collections[arg]) {
      const fields = collections[arg];
      await migrateCollection(arg, fields.lat, fields.lng);
    } else {
      console.error(`❌ Unknown collection: ${arg}`);
      console.log(`\nAvailable collections:`);
      Object.keys(collections).forEach(c => console.log(`  - ${c}`));
      process.exit(1);
    }

    console.log('\n✅ All migrations complete!');
    console.log('\nNext steps:');
    console.log('1. Deploy updated Firestore indexes:');
    console.log('   cd cykel && firebase deploy --only firestore:indexes');
    console.log('2. Test proximity queries in the app');
    console.log('3. Monitor query performance in Firebase Console');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
