/**
 * CYKEL - Firebase Cloud Functions Index
 * Main entry point for all Cloud Functions
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

// Import thumbnail generation function
const { generateThumbnail, cleanupThumbnails } = require('./thumbnail-generator');

// Export all functions
exports.generateThumbnail = generateThumbnail;
exports.cleanupThumbnails = cleanupThumbnails;

// Import existing functions
exports.testNearbyEvent = require('./test_nearby_event');
exports.migrateAnalytics = require('./migrate-analytics');
exports.getUserInfo = require('./get_user_info');
exports.findMyUser = require('./find_my_user');
