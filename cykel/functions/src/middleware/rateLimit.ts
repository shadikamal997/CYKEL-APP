/**
 * Rate Limiting Middleware
 * Prevents spam and DoS attacks by limiting actions per user
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v1';

interface RateLimitConfig {
  maxActions: number;
  windowMinutes: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  createMarketplaceListing: { maxActions: 10, windowMinutes: 60 },
  createEvent: { maxActions: 5, windowMinutes: 60 },
  sendMessage: { maxActions: 50, windowMinutes: 5 },
  createProviderSubmission: { maxActions: 3, windowMinutes: 1440 }, // 1 per day
};

/**
 * Check if user is within rate limit for an action
 */
export async function checkRateLimit(
  userId: string,
  action: keyof typeof RATE_LIMITS
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const db = admin.firestore();
  const config = RATE_LIMITS[action];
  
  if (!config) {
    throw new Error(`Unknown action: ${action}`);
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMinutes * 60000);

  const rateLimitRef = db.collection('rateLimits').doc(`${userId}_${action}`);
  const rateLimitDoc = await rateLimitRef.get();

  if (!rateLimitDoc.exists) {
    // First action, create rate limit document
    await rateLimitRef.set({
      userId,
      action,
      count: 1,
      windowStart: admin.firestore.Timestamp.fromDate(windowStart),
      lastAction: admin.firestore.Timestamp.now(),
    });

    return {
      allowed: true,
      remaining: config.maxActions - 1,
      resetAt: new Date(now.getTime() + config.windowMinutes * 60000),
    };
  }

  const data = rateLimitDoc.data()!;
  const docWindowStart = data.windowStart.toDate();

  // Check if window has expired
  if (docWindowStart < windowStart) {
    // Reset window
    await rateLimitRef.set({
      userId,
      action,
      count: 1,
      windowStart: admin.firestore.Timestamp.fromDate(windowStart),
      lastAction: admin.firestore.Timestamp.now(),
    });

    return {
      allowed: true,
      remaining: config.maxActions - 1,
      resetAt: new Date(now.getTime() + config.windowMinutes * 60000),
    };
  }

  // Check if limit exceeded
  if (data.count >= config.maxActions) {
    const resetAt = new Date(docWindowStart.getTime() + config.windowMinutes * 60000);
    
    functions.logger.warn(`[checkRateLimit] User ${userId} exceeded rate limit for ${action}`, {
      count: data.count,
      maxActions: config.maxActions,
      resetAt: resetAt.toISOString(),
    });

    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }

  // Increment count
  await rateLimitRef.update({
    count: admin.firestore.FieldValue.increment(1),
    lastAction: admin.firestore.Timestamp.now(),
  });

  return {
    allowed: true,
    remaining: config.maxActions - (data.count + 1),
    resetAt: new Date(docWindowStart.getTime() + config.windowMinutes * 60000),
  };
}

/**
 * Get current rate limit info for a user
 */
export async function getRateLimitInfo(
  userId: string,
  action: keyof typeof RATE_LIMITS
): Promise<{ count: number; remaining: number; resetAt: Date }> {
  const db = admin.firestore();
  const config = RATE_LIMITS[action];

  if (!config) {
    throw new Error(`Unknown action: ${action}`);
  }

  const rateLimitRef = db.collection('rateLimits').doc(`${userId}_${action}`);
  const rateLimitDoc = await rateLimitRef.get();

  if (!rateLimitDoc.exists) {
    return {
      count: 0,
      remaining: config.maxActions,
      resetAt: new Date(Date.now() + config.windowMinutes * 60000),
    };
  }

  const data = rateLimitDoc.data()!;
  const windowStart = data.windowStart.toDate();
  const resetAt = new Date(windowStart.getTime() + config.windowMinutes * 60000);

  // Check if window expired
  if (resetAt < new Date()) {
    return {
      count: 0,
      remaining: config.maxActions,
      resetAt: new Date(Date.now() + config.windowMinutes * 60000),
    };
  }

  return {
    count: data.count || 0,
    remaining: Math.max(0, config.maxActions - (data.count || 0)),
    resetAt,
  };
}

/**
 * Clear rate limit for a user (admin override)
 */
export async function clearRateLimit(userId: string, action: string): Promise<void> {
  const db = admin.firestore();
  const rateLimitRef = db.collection('rateLimits').doc(`${userId}_${action}`);
  await rateLimitRef.delete();
  
  functions.logger.info(`[clearRateLimit] Cleared rate limit for user ${userId}, action ${action}`);
}

/**
 * Cleanup old rate limit documents (scheduled function)
 */
export async function cleanupOldRateLimits(): Promise<number> {
  const db = admin.firestore();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const oldDocs = await db
    .collection('rateLimits')
    .where('lastAction', '<', admin.firestore.Timestamp.fromDate(sevenDaysAgo))
    .limit(500)
    .get();

  const batch = db.batch();
  oldDocs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  functions.logger.info(`[cleanupOldRateLimits] Deleted ${oldDocs.size} old rate limit documents`);
  return oldDocs.size;
}
