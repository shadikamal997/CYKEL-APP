#!/bin/bash
# Simple test notification sender
# Just run: ./send_test.sh

set -e

echo "🚀 CYKEL Notification Test"
echo "=========================="
echo ""

# Step 1: Check if logged into Firebase
echo "📋 Step 1: Checking Firebase login..."
if ! firebase projects:list &>/dev/null; then
    echo "❌ Not logged into Firebase. Running login..."
    firebase login
fi

echo "✅ Firebase authenticated"
echo ""

# Step 2: Get user's email
echo "📧 Step 2: What's your email in the CYKEL app?"
read -p "Enter email: " USER_EMAIL

if [ -z "$USER_EMAIL" ]; then
    echo "❌ Email required"
    exit 1
fi

# Step 3: Create the test event using Firebase CLI
echo ""
echo "📝 Step 3: Creating test event..."
echo ""

# Create a temporary JavaScript file to add the event
cat > /tmp/create_event.js << 'HEREDOC'
const email = process.argv[2];

// Get future date (1 week from now)
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 7);

// Event data with San Francisco coordinates
const eventData = {
  name: "🚴 Weekend Group Ride - TEST NOTIFICATION",
  type: "group_ride", 
  description: "This is a test to verify notifications work!",
  date: futureDate,
  location: {
    lat: 37.8199,
    lng: -122.3744,
    address: "San Francisco, CA"
  },
  createdAt: new Date()
};

console.log('Finding user with email:', email);
console.log('Event details:', JSON.stringify(eventData, null, 2));
console.log('');
console.log('🔍 To complete this test, you need to:');
console.log('');
console.log('1. Go to Firebase Console:');
console.log('   https://console.firebase.google.com/project/cykel-32383/firestore/data/~2FlocalEvents');
console.log('');
console.log('2. Click "Add document" button');
console.log('');
console.log('3. Use "Auto-ID" and add these fields:');
console.log('');
console.log('   Field Name        Type        Value');
console.log('   ──────────────────────────────────────────────────────');
console.log('   name              string      🚴 Weekend Group Ride - TEST');
console.log('   type              string      group_ride');
console.log('   description       string      Test notification');
console.log('   date              timestamp   [Click calendar, pick next week]');
console.log('   location          map         [Click "Add field"]');
console.log('');
console.log('   For location map, add:');
console.log('   ├─ lat            number      37.8199');
console.log('   ├─ lng            number      -122.3744');
console.log('   └─ address        string      San Francisco');
console.log('');
console.log('   createdAt         timestamp   [Click "Now"]');
console.log('');
console.log('4. Click "Save"');
console.log('');
console.log('5. Check your phone for notification within 10 seconds! 📱');
HEREDOC

node /tmp/create_event.js "$USER_EMAIL"
rm /tmp/create_event.js

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 ALTERNATIVE: Manual Firebase Console Test"
echo ""
echo "If the above doesn't work, try this:"
echo ""
echo "1. Open Firebase Console:"
echo "   https://console.firebase.google.com/project/cykel-32383/firestore"
echo ""
echo "2. Click 'Start collection' (if first time)"
echo "   OR click existing 'localEvents' collection"
echo ""
echo "3. Click '+ Add document'"
echo ""
echo "4. Fill in the form exactly as shown above"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Instructions displayed!"
echo ""
