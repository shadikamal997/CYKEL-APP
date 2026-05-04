#!/bin/bash
# One-command test notification - just run this!

echo "🚀 Creating test event to trigger notification..."
echo ""

# Get Firebase access token
echo "🔐 Getting Firebase access token..."
ACCESS_TOKEN=$(firebase login:ci 2>/dev/null || firebase --token 2>/dev/null || gcloud auth print-access-token 2>/dev/null)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Could not get access token."
    echo ""
    echo "Please run one of these first:"
    echo "  firebase login"
    echo "  OR"
    echo "  gcloud auth login"
    echo ""
    exit 1
fi

echo "✅ Got access token"
echo ""

# Create event data
FUTURE_DATE=$(date -u -v+7d +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -d "+7 days" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null)
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

EVENT_JSON=$(cat <<EOF
{
  "fields": {
    "name": {"stringValue": "🚴 Weekend Group Ride - TEST"},
    "type": {"stringValue": "group_ride"},
    "description": {"stringValue": "Testing notification system!"},
    "date": {"timestampValue": "${FUTURE_DATE}"},
    "location": {
      "mapValue": {
        "fields": {
          "lat": {"doubleValue": 37.8199},
          "lng": {"doubleValue": -122.3744},
          "address": {"stringValue": "San Francisco, CA"}
        }
      }
    },
    "createdAt": {"timestampValue": "${NOW}"}
  }
}
EOF
)

echo "📝 Creating event in Firestore..."
echo ""

# Make the API call
RESPONSE=$(curl -s -X POST \
  "https://firestore.googleapis.com/v1/projects/cykel-32383/databases/(default)/documents/localEvents" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${EVENT_JSON}")

# Check if successful
if echo "$RESPONSE" | grep -q '"name"'; then
    echo "✅ Event created successfully!"
    echo ""
    echo "📱 Check your phone now!"
    echo ""
    echo "Expected notification:"
    echo "  🚴 Local Cycling Event"
    echo "  Weekend Group Ride - TEST on [date] • X.Xkm away"
    echo ""
    echo "🔍 Event ID:"
    echo "$RESPONSE" | grep -o '"name":"projects/cykel-32383/databases/(default)/documents/localEvents/[^"]*"' | cut -d'/' -f6 | tr -d '"'
    echo ""
    echo "📊 View in Firebase Console:"
    echo "https://console.firebase.google.com/project/cykel-32383/firestore/data/~2FlocalEvents"
else
    echo "❌ Failed to create event"
    echo ""
    echo "Response:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    echo ""
    echo "💡 Try the manual method instead:"
    echo "   Open: https://console.firebase.google.com/project/cykel-32383/firestore/data/~2FlocalEvents"
    echo "   Click: Add document"
    echo "   See: SIMPLE_TEST_GUIDE.md for details"
fi

echo ""
