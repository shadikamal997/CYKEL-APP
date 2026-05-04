#!/bin/bash
# Quick script to send test notification
# Usage: ./send_test_notification.sh <userId>

set -e

USER_ID=$1

if [ -z "$USER_ID" ]; then
    echo "❌ Usage: ./send_test_notification.sh <userId>"
    echo ""
    echo "💡 To find your user ID:"
    echo "   1. Go to Firebase Console: https://console.firebase.google.com/project/cykel-32383/firestore"
    echo "   2. Click on 'users' collection"
    echo "   3. Find your document by email"
    echo "   4. Copy the Document ID"
    echo ""
    exit 1
fi

echo "🚀 Creating test event for user: $USER_ID"
echo ""

# Create a temporary Firebase script
cat > /tmp/create_test_event.js << EOF
const userId = '$USER_ID';
const eventData = {
  name: '🚴 Weekend Group Ride - TEST',
  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  location: {
    lat: 37.7749 + 0.045,
    lng: -122.4194 + 0.045,
    address: 'Test Event Location'
  },
  type: 'group_ride',
  description: 'This is a test event to verify notifications!',
  createdAt: new Date()
};

console.log('User ID:', userId);
console.log('Event:', eventData);
EOF

echo "📝 Event details:"
echo "   Name: Weekend Group Ride - TEST"
echo "   Date: 1 week from now"
echo "   Type: group_ride"
echo ""
echo "📍 Check Firebase Console to create manually:"
echo "   https://console.firebase.google.com/project/cykel-32383/firestore/data/~2FlocalEvents"
echo ""
echo "Or use Firebase Console UI to add this document to 'localEvents' collection:"
cat /tmp/create_test_event.js
rm /tmp/create_test_event.js
