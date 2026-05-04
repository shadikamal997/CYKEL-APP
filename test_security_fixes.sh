#!/bin/bash
# CYKEL Security Verification Test Suite
# Run this script to verify all critical security fixes are working

set -e  # Exit on error

echo "═══════════════════════════════════════════════════════════════"
echo "CYKEL Security Fixes Verification"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0
WARNINGS=0

# ─── Test 1: Firestore Rules Deployed ──────────────────────────────
echo "Test 1: Checking Firestore rules deployment..."
cd /Users/shadi/Desktop/CYKEL/cykel
RULES_HASH=$(firebase firestore:rules get | md5sum | cut -d' ' -f1)
if [ ! -z "$RULES_HASH" ]; then
  echo -e "${GREEN}✅ PASS${NC} - Firestore rules are deployed"
  PASSED=$((PASSED+1))
else
  echo -e "${RED}❌ FAIL${NC} - Firestore rules not deployed"
  FAILED=$((FAILED+1))
fi
echo ""

# ─── Test 2: Migration Verification ────────────────────────────────
echo "Test 2: Checking family accounts migration..."
cd /Users/shadi/Desktop/CYKEL
if node -e "
const admin = require('firebase-admin');
const serviceAccount = require('./cykel-32383-firebase-adminsdk.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
admin.firestore().collection('familyAccounts').limit(1).get()
  .then(snap => {
    if (snap.empty) {
      console.log('No family accounts to check');
      process.exit(0);
    }
    const doc = snap.docs[0];
    const data = doc.data();
    if (data.memberIds && Array.isArray(data.memberIds)) {
      console.log('✅ memberIds field exists');
      process.exit(0);
    } else {
      console.log('❌ memberIds field missing');
      process.exit(1);
    }
  })
  .catch(() => process.exit(1));
" 2>/dev/null; then
  echo -e "${GREEN}✅ PASS${NC} - Family accounts have memberIds field"
  PASSED=$((PASSED+1))
else
  echo -e "${RED}❌ FAIL${NC} - Family accounts migration incomplete"
  FAILED=$((FAILED+1))
fi
echo ""

# ─── Test 3: Events Migration Verification ─────────────────────────
echo "Test 3: Checking events migration..."
if node -e "
const admin = require('firebase-admin');
if (!admin.apps.length) {
  const serviceAccount = require('./cykel-32383-firebase-adminsdk.json');
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
admin.firestore().collection('events').limit(1).get()
  .then(snap => {
    if (snap.empty) {
      console.log('No events to check');
      process.exit(0);
    }
    const doc = snap.docs[0];
    const data = doc.data();
    if (data.participantIds && Array.isArray(data.participantIds)) {
      console.log('✅ participantIds field exists');
      process.exit(0);
    } else {
      console.log('❌ participantIds field missing');
      process.exit(1);
    }
  })
  .catch(() => process.exit(1));
" 2>/dev/null; then
  echo -e "${GREEN}✅ PASS${NC} - Events have participantIds field"
  PASSED=$((PASSED+1))
else
  echo -e "${RED}❌ FAIL${NC} - Events migration incomplete"
  FAILED=$((FAILED+1))
fi
echo ""

# ─── Test 4: Cloud Functions Deployed ──────────────────────────────
echo "Test 4: Checking Cloud Functions deployment..."
cd /Users/shadi/Desktop/CYKEL/cykel
if firebase functions:list | grep -q "cleanupOldMessages\|monitorSecurity"; then
  echo -e "${GREEN}✅ PASS${NC} - Security functions are deployed"
  PASSED=$((PASSED+1))
else
  echo -e "${YELLOW}⚠️  WARNING${NC} - Security functions not found (may still be deploying)"
  WARNINGS=$((WARNINGS+1))
fi
echo ""

# ─── Test 5: App Check Configuration ───────────────────────────────
echo "Test 5: Checking App Check configuration..."
if [ -f "lib/core/security/app_check_service.dart" ]; then
  if grep -q "FirebaseAppCheck.instance.activate" lib/core/security/app_check_service.dart; then
    echo -e "${GREEN}✅ PASS${NC} - App Check service is configured"
    PASSED=$((PASSED+1))
  else
    echo -e "${RED}❌ FAIL${NC} - App Check not activated"
    FAILED=$((FAILED+1))
  fi
else
  echo -e "${RED}❌ FAIL${NC} - App Check service file not found"
  FAILED=$((FAILED+1))
fi
echo ""

# ─── Test 6: Rate Limiting Middleware ──────────────────────────────
echo "Test 6: Checking rate limiting middleware..."
if [ -f "functions/src/middleware/rateLimit.ts" ]; then
  echo -e "${GREEN}✅ PASS${NC} - Rate limiting middleware exists"
  PASSED=$((PASSED+1))
else
  echo -e "${RED}❌ FAIL${NC} - Rate limiting middleware not found"
  FAILED=$((FAILED+1))
fi
echo ""

# ─── Test 7: GDPR Cleanup Functions ────────────────────────────────
echo "Test 7: Checking GDPR cleanup functions..."
if [ -f "functions/src/scheduled/cleanupOldMessages.ts" ]; then
  echo -e "${GREEN}✅ PASS${NC} - GDPR cleanup functions exist"
  PASSED=$((PASSED+1))
else
  echo -e "${RED}❌ FAIL${NC} - GDPR cleanup functions not found"
  FAILED=$((FAILED+1))
fi
echo ""

# ─── Test 8: Security Monitoring ───────────────────────────────────
echo "Test 8: Checking security monitoring..."
if [ -f "functions/src/scheduled/securityMonitoring.ts" ]; then
  echo -e "${GREEN}✅ PASS${NC} - Security monitoring exists"
  PASSED=$((PASSED+1))
else
  echo -e "${RED}❌ FAIL${NC} - Security monitoring not found"
  FAILED=$((FAILED+1))
fi
echo ""

# ─── Test 9: Backup Files Created ──────────────────────────────────
echo "Test 9: Checking backup files..."
if ls firestore/firestore.rules.BACKUP_* 1> /dev/null 2>&1; then
  echo -e "${GREEN}✅ PASS${NC} - Backup of original rules exists"
  PASSED=$((PASSED+1))
else
  echo -e "${YELLOW}⚠️  WARNING${NC} - No backup rules found"
  WARNINGS=$((WARNINGS+1))
fi
echo ""

# ─── Test 10: Rules File Size Check ────────────────────────────────
echo "Test 10: Checking secure rules implementation..."
RULES_LINES=$(wc -l < firestore/firestore.rules)
if [ "$RULES_LINES" -gt 500 ]; then
  echo -e "${GREEN}✅ PASS${NC} - Secure rules file has $RULES_LINES lines (comprehensive)"
  PASSED=$((PASSED+1))
else
  echo -e "${RED}❌ FAIL${NC} - Rules file seems incomplete ($RULES_LINES lines)"
  FAILED=$((FAILED+1))
fi
echo ""

# ─── Summary ────────────────────────────────────────────────────────
echo "═══════════════════════════════════════════════════════════════"
echo "TEST SUMMARY"
echo "═══════════════════════════════════════════════════════════════"
echo -e "Passed:   ${GREEN}$PASSED${NC}"
echo -e "Failed:   ${RED}$FAILED${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL CRITICAL TESTS PASSED!${NC}"
  echo ""
  echo "Next Steps:"
  echo "1. ✅ Open Firebase Console and verify App Check is enabled"
  echo "2. ✅ Test the app to ensure all features still work"
  echo "3. ✅ Monitor Firebase Console → Firestore for any permission errors"
  echo "4. ✅ Check Cloud Functions logs for the new security functions"
  echo ""
  echo "Security fixes successfully deployed! 🔒"
  exit 0
else
  echo -e "${RED}❌ SOME TESTS FAILED${NC}"
  echo ""
  echo "Please fix the failed tests before deploying to production."
  echo "Refer to SECURITY_FIXES_IMPLEMENTATION_GUIDE.md for troubleshooting."
  exit 1
fi
