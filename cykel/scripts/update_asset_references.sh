#!/bin/bash

# CYKEL Asset Reference Updater
# Updates all .jpg/.png references to .webp in Dart code

echo "🔄 CYKEL ASSET REFERENCE UPDATER"
echo "=================================="
echo ""

cd "$(dirname "$0")/.."

echo "🔍 Scanning for asset references..."
echo ""

# Backup tracking
UPDATES_MADE=0

# Function to update file
update_file() {
    local file="$1"
    local changed=0
    
    # Check if file contains asset references
    if grep -q "assets/images.*\.\(jpg\|jpeg\|png\)" "$file" 2>/dev/null; then
        echo "📝 Updating: $file"
        
        # Create backup
        cp "$file" "${file}.bak"
        
        # Replace .jpg with .webp
        if sed -i '' 's/assets\/images\/\([^"'"'"']*\)\.jpg/assets\/images\/\1.webp/g' "$file" 2>/dev/null; then
            changed=1
        fi
        
        # Replace .jpeg with .webp
        if sed -i '' 's/assets\/images\/\([^"'"'"']*\)\.jpeg/assets\/images\/\1.webp/g' "$file" 2>/dev/null; then
            changed=1
        fi
        
        # Replace .png with .webp
        if sed -i '' 's/assets\/images\/\([^"'"'"']*\)\.png/assets\/images\/\1.webp/g' "$file" 2>/dev/null; then
            changed=1
        fi
        
        if [ $changed -eq 1 ]; then
            # Show diff
            echo "   Changes:"
            diff -u "${file}.bak" "$file" | grep "^[+-].*assets/images" | head -5
            rm "${file}.bak"
            UPDATES_MADE=$((UPDATES_MADE + 1))
            echo ""
        else
            # No changes, restore backup
            rm "${file}.bak"
        fi
    fi
}

# Find and update all Dart files
echo "📂 Scanning lib/ directory..."
find lib -name "*.dart" -type f | while read -r file; do
    update_file "$file"
done

# Update pubspec.yaml if needed
if grep -q "assets/images.*\.\(jpg\|jpeg\|png\)" pubspec.yaml 2>/dev/null; then
    echo "📝 Updating: pubspec.yaml"
    cp pubspec.yaml pubspec.yaml.bak
    
    sed -i '' 's/assets\/images\/\([^"]*\)\.jpg/assets\/images\/\1.webp/g' pubspec.yaml
    sed -i '' 's/assets\/images\/\([^"]*\)\.jpeg/assets\/images\/\1.webp/g' pubspec.yaml
    sed -i '' 's/assets\/images\/\([^"]*\)\.png/assets\/images\/\1.webp/g' pubspec.yaml
    
    rm pubspec.yaml.bak
    UPDATES_MADE=$((UPDATES_MADE + 1))
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ UPDATE COMPLETE!"
echo ""
echo "📊 Statistics:"
echo "   Files updated: $UPDATES_MADE"
echo ""
echo "🎯 Next steps:"
echo "   1. Run: flutter pub get"
echo "   2. Run: flutter clean && flutter build apk --release"
echo "   3. Verify no broken images in app"
echo ""
