#!/bin/bash
# Firebase Security Monitoring Script
# Monitors Firebase Console for errors and security issues

echo "🔍 CYKEL Security Monitoring Dashboard"
echo "======================================"
echo ""

PROJECT_ID="cykel-32383"

echo "📊 Checking Firebase Functions Status..."
echo "----------------------------------------"
firebase functions:log --project $PROJECT_ID --limit 20 --filter "severity>=WARNING"

echo ""
echo "🚨 Checking Security Alerts..."
echo "----------------------------------------"
# This would need to be called through Firebase Functions
echo "To check security alerts, run:"
echo "  firebase functions:shell"
echo "  adminGetSecurityAlerts({limit: 10})"

echo ""
echo "📈 Firestore Usage (Check in Console):"
echo "https://console.firebase.google.com/project/$PROJECT_ID/firestore/usage"

echo ""
echo "⚙️ Cloud Functions Status:"
echo "https://console.firebase.google.com/project/$PROJECT_ID/functions/list"

echo ""
echo "🔐 App Check Status:"
echo "https://console.firebase.google.com/project/$PROJECT_ID/appcheck"

echo ""
echo "✅ Quick Health Checks:"
echo "----------------------------------------"

# Check for recent errors in functions
ERROR_COUNT=$(firebase functions:log --project $PROJECT_ID --limit 100 --filter "severity=ERROR" 2>/dev/null | wc -l)
echo "Recent errors in functions: $ERROR_COUNT"

if [ $ERROR_COUNT -gt 10 ]; then
  echo "⚠️  WARNING: High error count detected!"
else
  echo "✓ Error count is normal"
fi

echo ""
echo "📝 Monitoring Commands:"
echo "----------------------------------------"
echo "Watch real-time logs:  firebase functions:log --project $PROJECT_ID"
echo "Check security alerts: Open Firebase Console > Firestore > securityAlerts collection"
echo "Check rate limits:     Open Firebase Console > Firestore > rateLimits collection"

echo ""
echo "🔄 Scheduled Functions (check they're running):"
echo "----------------------------------------"
echo "scheduledCleanupOldMessages    → Daily at 2 AM UTC (GDPR compliance)"
echo "scheduledSecurityMonitoring    → Every 5 minutes (spam detection)"
echo "scheduledCleanupRateLimits     → Daily at 3 AM UTC (cleanup)"

echo ""
echo "Monitor deployment at: /tmp/firebase_deploy_security.log"
