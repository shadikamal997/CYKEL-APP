#!/bin/bash
# CYKEL - Get SSL Certificate Fingerprints for Certificate Pinning
# Run this script to obtain SHA-256 fingerprints for certificate pinning

echo "=========================================="
echo "CYKEL Certificate Fingerprint Checker"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to get certificate fingerprint
get_fingerprint() {
    local host=$1
    local port=${2:-443}
    
    echo -e "${YELLOW}Fetching certificate for $host:$port...${NC}"
    
    # Get certificate and calculate SHA-256 fingerprint
    fingerprint=$(echo | openssl s_client -connect $host:$port -servername $host 2>/dev/null | \
                  openssl x509 -fingerprint -sha256 -noout 2>/dev/null | \
                  cut -d'=' -f2)
    
    if [ -z "$fingerprint" ]; then
        echo "❌ Failed to get certificate for $host"
        return 1
    fi
    
    # Get certificate validity dates
    validity=$(echo | openssl s_client -connect $host:$port -servername $host 2>/dev/null | \
               openssl x509 -noout -dates 2>/dev/null)
    
    echo -e "${GREEN}✅ Certificate for $host${NC}"
    echo "   Fingerprint: $fingerprint"
    echo "   $validity"
    echo ""
}

# Google APIs
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Google APIs (googleapis.com)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
get_fingerprint "googleapis.com"
get_fingerprint "maps.googleapis.com"

# Firebase
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Firebase Services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
get_fingerprint "firebase.googleapis.com"
get_fingerprint "firestore.googleapis.com"

# Weather API
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Weather API (open-meteo.com)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
get_fingerprint "api.open-meteo.com"

echo ""
echo "=========================================="
echo "How to Use These Fingerprints"
echo "=========================================="
echo ""
echo "1. Copy the fingerprints above"
echo ""
echo "2. Update lib/core/security/certificate_pinning_service.dart:"
echo ""
echo "   class CertificateFingerprints {"
echo "     static const List<String> googleApis = ["
echo "       'paste-googleapis-fingerprint-here',"
echo "       'paste-maps-fingerprint-here',"
echo "     ];"
echo ""
echo "     static const List<String> firebase = ["
echo "       'paste-firebase-fingerprint-here',"
echo "     ];"
echo ""
echo "     static const List<String> weather = ["
echo "       'paste-weather-fingerprint-here',"
echo "     ];"
echo "   }"
echo ""
echo "3. Important Notes:"
echo "   - Certificates expire (typically 1-2 years)"
echo "   - Pin BOTH current AND backup certificates"
echo "   - Run this script quarterly to check for upcoming expirations"
echo "   - Update fingerprints BEFORE certificates expire"
echo ""
echo "4. Monitor Certificate Expiration:"
echo "   - Set calendar reminder 2 months before expiry"
echo "   - Test new fingerprints in staging first"
echo "   - Deploy app update before certificate rotation"
echo ""
echo "5. Alternative: Use Firebase Remote Config"
echo "   - Store fingerprints in Remote Config"
echo "   - Update without app release (for emergencies)"
echo "   - Fallback: disable pinning if config unavailable"
echo ""
echo "=========================================="
echo ""

# Save to file
output_file="certificate_fingerprints_$(date +%Y%m%d).txt"
echo "Saving fingerprints to: $output_file"

{
    echo "CYKEL Certificate Fingerprints"
    echo "Generated: $(date)"
    echo ""
    echo "Google APIs:"
    echo | openssl s_client -connect googleapis.com:443 2>/dev/null | openssl x509 -fingerprint -sha256 -noout
    echo | openssl s_client -connect maps.googleapis.com:443 2>/dev/null | openssl x509 -fingerprint -sha256 -noout
    echo ""
    echo "Firebase:"
    echo | openssl s_client -connect firebase.googleapis.com:443 2>/dev/null | openssl x509 -fingerprint -sha256 -noout
    echo | openssl s_client -connect firestore.googleapis.com:443 2>/dev/null | openssl x509 -fingerprint -sha256 -noout
    echo ""
    echo "Weather API:"
    echo | openssl s_client -connect api.open-meteo.com:443 2>/dev/null | openssl x509 -fingerprint -sha256 -noout
} > "$output_file"

echo -e "${GREEN}✅ Fingerprints saved to: $output_file${NC}"
echo ""
