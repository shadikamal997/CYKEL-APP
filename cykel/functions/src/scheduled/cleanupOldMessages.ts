/**
 * GDPR Compliance: Auto-delete old chat messages
 * Messages older than 90 days are automatically deleted
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v1';

const RETENTION_DAYS = 90;

/**
 * Delete chat messages older than 90 days (GDPR compliance)
 * Runs daily at 2 AM UTC
 */
export async function cleanupOldMessages(): Promise<void> {
  const db = admin.firestore();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

  functions.logger.info(`[cleanupOldMessages] Starting cleanup for messages older than ${cutoffDate.toISOString()}`);

  let totalDeleted = 0;
  const collections = ['eventChats', 'rentalChats', 'directMessages'];

  for (const collectionName of collections) {
    try {
      const oldMessages = await db
        .collection(collectionName)
        .where('timestamp', '<', admin.firestore.Timestamp.fromDate(cutoffDate))
        .limit(500)
        .get();

      if (oldMessages.empty) {
        functions.logger.info(`[cleanupOldMessages] No old messages found in ${collectionName}`);
        continue;
      }

      const batch = db.batch();
      oldMessages.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      totalDeleted += oldMessages.size;

      functions.logger.info(`[cleanupOldMessages] Deleted ${oldMessages.size} messages from ${collectionName}`);
    } catch (error) {
      functions.logger.error(`[cleanupOldMessages] Error cleaning ${collectionName}:`, error);
    }
  }

  functions.logger.info(`[cleanupOldMessages] Cleanup complete. Total deleted: ${totalDeleted}`);
}

/**
 * Manual cleanup trigger for admins
 * Allows admin to trigger message cleanup on demand
 */
export async function manualCleanupMessages(days?: number): Promise<{ success: boolean; deleted: number; collections: Record<string, number> }> {
  const db = admin.firestore();
  const retentionDays = days || RETENTION_DAYS;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  functions.logger.info(`[manualCleanupMessages] Manual cleanup triggered for messages older than ${cutoffDate.toISOString()}`);

  const results: Record<string, number> = {};
  let totalDeleted = 0;
  const collections = ['eventChats', 'rentalChats', 'directMessages'];

  for (const collectionName of collections) {
    try {
      let collectionDeleted = 0;
      let hasMore = true;

      // Process in batches to avoid timeout
      while (hasMore) {
        const oldMessages = await db
          .collection(collectionName)
          .where('timestamp', '<', admin.firestore.Timestamp.fromDate(cutoffDate))
          .limit(500)
          .get();

        if (oldMessages.empty) {
          hasMore = false;
          break;
        }

        const batch = db.batch();
        oldMessages.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();
        collectionDeleted += oldMessages.size;
        totalDeleted += oldMessages.size;

        // Check if there are more documents
        hasMore = oldMessages.size === 500;
      }

      results[collectionName] = collectionDeleted;
      functions.logger.info(`[manualCleanupMessages] Deleted ${collectionDeleted} messages from ${collectionName}`);
    } catch (error) {
      functions.logger.error(`[manualCleanupMessages] Error cleaning ${collectionName}:`, error);
      results[collectionName] = 0;
    }
  }

  functions.logger.info(`[manualCleanupMessages] Manual cleanup complete. Total deleted: ${totalDeleted}`);

  return {
    success: true,
    deleted: totalDeleted,
    collections: results,
  };
}
