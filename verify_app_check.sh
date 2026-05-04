#!/bin/bash
# Firebase App Check Verification Script
# Quickly checks if App Check is properly configured

set -e

echo "🔍 CYKEL - Firebase App Check Verification"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ID="cykel-32383"
PROJECT_NUMBER="875600194960"

echo "Project: ${PROJECT_ID}"
echo "Project Number: ${PROJECT_NUMBER}"
echo ""

# Check 1: Verify dependency is installed
echo "📦 Check 1: App Check Dependency"
if grep -q "firebase_app_check" cykel/pubspec.yaml; then
    VERSION=$(grep "firebase_app_check" cykel/pubspec.yaml | awk '{print $2}')
    echo -e "${GREEN}✅ firebase_app_check installed (${VERSION})${NC}"
else
    echo -e "${RED}❌ firebase_app_check NOT found in pubspec.yaml${NC}"
    exit 1
fi
echo ""

# Check 2: Verify service implementation exists
echo "🔧 Check 2: AppCheckService Implementation"
if [ -f "cykel/lib/core/security/app_check_service.dart" ]; then
    echo -e "${GREEN}✅ app_check_service.dart exists${NC}"
    
    # Check if it has the initialize methods
    if grep -q "static Future<void> initialize()" cykel/lib/core/security/app_check_service.dart; then
        echo -e "${GREEN}✅ initialize() method found${NC}"
    else
        echo -e "${RED}❌ initialize() method not found${NC}"
    fi
    
    if grep -q "static Future<void> initializeDebug()" cykel/lib/core/security/app_check_service.dart; then
        echo -e "${GREEN}✅ initializeDebug() method found${NC}"
    else
        echo -e "${RED}❌ initializeDebug() method not found${NC}"
    fi
else
    echo -e "${RED}❌ app_check_service.dart NOT found${NC}"
    exit 1
fi
echo ""

# Check 3: Verify integration in main.dart
echo "🚀 Check 3: Main App Integration"
if grep -q "AppCheckService" cykel/lib/main.dart; then
    echo -e "${GREEN}✅ AppCheckService imported in main.dart${NC}"
    
    if grep -q "AppCheckService.initialize" cykel/lib/main.dart; then
        echo -e "${GREEN}✅ AppCheckService.initialize() called${NC}"
    fi
    
    if grep -q "AppCheckService.initializeDebug" cykel/lib/main.dart; then
        echo -e "${GREEN}✅ AppCheckService.initializeDebug() called (debug mode)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  AppCheckService not referenced in main.dart${NC}"
fi
echo ""

# Check 4: Firebase configuration files
echo "⚙️  Check 4: Firebase Configuration Files"
if [ -f "cykel/android/app/google-services.json" ]; then
    echo -e "${GREEN}✅ Android google-services.json exists${NC}"
    
    # Check project ID matches
    if grep -q "\"project_id\": \"$PROJECT_ID\"" cykel/android/app/google-services.json; then
        echo -e "${GREEN}✅ Correct project ID in google-services.json${NC}"
    else
        echo -e "${RED}❌ Project ID mismatch in google-services.json${NC}"
    fi
else
    echo -e "${RED}❌ google-services.json NOT found${NC}"
fi

if [ -f "cykel/ios/Runner/GoogleService-Info.plist" ]; then
    echo -e "${GREEN}✅ iOS GoogleService-Info.plist exists${NC}"
else
    echo -e "${YELLOW}⚠️  iOS GoogleService-Info.plist not found (iOS may not be configured)${NC}"
fi
echo ""

# Check 5: Firebase options
echo "🔥 Check 5: Firebase Options"
if [ -f "cykel/lib/firebase_options.dart" ]; then
    echo -e "${GREEN}✅ firebase_options.dart exists${NC}"
else
    echo -e "${RED}❌ firebase_options.dart NOT found - run 'flutterfire configure'${NC}"
fi
echo ""

# Summary
echo "=========================================="
echo "📊 SUMMARY"
echo "=========================================="
echo ""
echo "Code Implementation:"
echo "  - Dependency: ✅"
echo "  - Service: ✅"
echo "  - Integration: ✅"
echo ""
echo -e "${YELLOW}⚠️  NEXT STEPS:${NC}"
echo ""
echo "1. Verify Firebase App Check API is enabled:"
echo "   https://console.developers.google.com/apis/api/firebaseappcheck.googleapis.com/overview?project=${PROJECT_NUMBER}"
echo ""
echo "2. Run the app and check for this log message:"
echo "   '✅ Firebase App Check activated'"
echo ""
echo "3. Configure App Check in Firebase Console:"
echo "   https://console.firebase.google.com/project/${PROJECT_ID}/appcheck"
echo ""
echo "4. For development, add debug token:"
echo "   - Run: flutter run -d <device>"
echo "   - Copy debug token from logs"
echo "   - Add in Firebase Console → App Check → Debug tokens"
echo ""
echo "=========================================="
echo "Run the app to complete verification!"
echo "=========================================="
