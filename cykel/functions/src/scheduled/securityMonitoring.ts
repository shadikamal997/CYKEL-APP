/**
 * Security Monitoring
 * Detects spam, abuse, and suspicious activity
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v1';

interface SecurityAlert {
  type: 'marketplace_spam' | 'event_spam' | 'message_spam' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  details: any;
  timestamp: admin.firestore.Timestamp;
  resolved: boolean;
}

/**
 * Check for marketplace spam (too many listings from one user)
 */
async function checkMarketplaceSpam(): Promise<SecurityAlert[]> {
  const db = admin.firestore();
  const alerts: SecurityAlert[] = [];
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  try {
    // Find users with more than 10 listings in the last hour
    const recentListings = await db
      .collection('marketplaceListings')
      .where('createdAt', '>', admin.firestore.Timestamp.fromDate(oneHourAgo))
      .get();

    const userCounts = new Map<string, number>();
    recentListings.forEach((doc) => {
      const userId = doc.data().userId;
      userCounts.set(userId, (userCounts.get(userId) || 0) + 1);
    });

    for (const [userId, count] of userCounts.entries()) {
      if (count > 10) {
        alerts.push({
          type: 'marketplace_spam',
          severity: count > 20 ? 'critical' : 'high',
          userId,
          details: { listingCount: count, timeWindow: '1 hour' },
          timestamp: admin.firestore.Timestamp.now(),
          resolved: false,
        });

        functions.logger.warn(`[checkMarketplaceSpam] User ${userId} created ${count} listings in 1 hour`);
      }
    }
  } catch (error) {
    functions.logger.error('[checkMarketplaceSpam] Error:', error);
  }

  return alerts;
}

/**
 * Check for event spam (too many events from one user)
 */
async function checkEventSpam(): Promise<SecurityAlert[]> {
  const db = admin.firestore();
  const alerts: SecurityAlert[] = [];
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  try {
    // Find users with more than 5 events in the last hour
    const recentEvents = await db
      .collection('events')
      .where('createdAt', '>', admin.firestore.Timestamp.fromDate(oneHourAgo))
      .get();

    const userCounts = new Map<string, number>();
    recentEvents.forEach((doc) => {
      const userId = doc.data().organizerId;
      userCounts.set(userId, (userCounts.get(userId) || 0) + 1);
    });

    for (const [userId, count] of userCounts.entries()) {
      if (count > 5) {
        alerts.push({
          type: 'event_spam',
          severity: count > 10 ? 'high' : 'medium',
          userId,
          details: { eventCount: count, timeWindow: '1 hour' },
          timestamp: admin.firestore.Timestamp.now(),
          resolved: false,
        });

        functions.logger.warn(`[checkEventSpam] User ${userId} created ${count} events in 1 hour`);
      }
    }
  } catch (error) {
    functions.logger.error('[checkEventSpam] Error:', error);
  }

  return alerts;
}

/**
 * Check for message spam
 */
async function checkMessageSpam(): Promise<SecurityAlert[]> {
  const db = admin.firestore();
  const alerts: SecurityAlert[] = [];
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  try {
    // Check event chats for spam
    const recentMessages = await db
      .collection('eventChats')
      .where('timestamp', '>', admin.firestore.Timestamp.fromDate(fiveMinutesAgo))
      .get();

    const userCounts = new Map<string, number>();
    recentMessages.forEach((doc) => {
      const userId = doc.data().userId;
      userCounts.set(userId, (userCounts.get(userId) || 0) + 1);
    });

    for (const [userId, count] of userCounts.entries()) {
      if (count > 50) {
        alerts.push({
          type: 'message_spam',
          severity: 'high',
          userId,
          details: { messageCount: count, timeWindow: '5 minutes' },
          timestamp: admin.firestore.Timestamp.now(),
          resolved: false,
        });

        functions.logger.warn(`[checkMessageSpam] User ${userId} sent ${count} messages in 5 minutes`);
      }
    }
  } catch (error) {
    functions.logger.error('[checkMessageSpam] Error:', error);
  }

  return alerts;
}

/**
 * Main monitoring function - runs every 5 minutes
 */
export async function monitorSecurity(): Promise<void> {
  const db = admin.firestore();
  
  functions.logger.info('[monitorSecurity] Starting security monitoring scan');

  try {
    const allAlerts: SecurityAlert[] = [];

    // Run all checks
    const [marketplaceAlerts, eventAlerts, messageAlerts] = await Promise.all([
      checkMarketplaceSpam(),
      checkEventSpam(),
      checkMessageSpam(),
    ]);

    allAlerts.push(...marketplaceAlerts, ...eventAlerts, ...messageAlerts);

    // Save alerts to Firestore
    if (allAlerts.length > 0) {
      const batch = db.batch();
      
      for (const alert of allAlerts) {
        const alertRef = db.collection('securityAlerts').doc();
        batch.set(alertRef, alert);
      }

      await batch.commit();

      functions.logger.warn(`[monitorSecurity] Created ${allAlerts.length} security alerts`, {
        marketplace: marketplaceAlerts.length,
        events: eventAlerts.length,
        messages: messageAlerts.length,
      });

      // Send notification to admins for critical alerts
      const criticalAlerts = allAlerts.filter(a => a.severity === 'critical');
      if (criticalAlerts.length > 0) {
        // TODO: Implement admin notification (email, push notification, etc.)
        functions.logger.error(`[monitorSecurity] CRITICAL: ${criticalAlerts.length} critical security alerts detected`);
      }
    } else {
      functions.logger.info('[monitorSecurity] No security issues detected');
    }
  } catch (error) {
    functions.logger.error('[monitorSecurity] Error during security monitoring:', error);
  }
}

/**
 * Get security alerts (for admin dashboard)
 */
export async function getSecurityAlerts(limit = 50): Promise<SecurityAlert[]> {
  const db = admin.firestore();
  
  try {
    const alertsSnapshot = await db
      .collection('securityAlerts')
      .where('resolved', '==', false)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return alertsSnapshot.docs.map(doc => doc.data() as SecurityAlert);
  } catch (error) {
    functions.logger.error('[getSecurityAlerts] Error:', error);
    return [];
  }
}

/**
 * Resolve a security alert
 */
export async function resolveSecurityAlert(alertId: string, resolvedBy: string): Promise<void> {
  const db = admin.firestore();
  
  await db.collection('securityAlerts').doc(alertId).update({
    resolved: true,
    resolvedAt: admin.firestore.Timestamp.now(),
    resolvedBy,
  });

  functions.logger.info(`[resolveSecurityAlert] Alert ${alertId} resolved by ${resolvedBy}`);
}
