#!/bin/bash

# CYKEL Comprehensive Asset Optimization Script
# Reduces APK from 147MB to <50MB by optimizing images
# Maintains visual quality while drastically reducing file sizes

set -e  # Exit on error

echo "🎨 CYKEL COMPREHENSIVE ASSET OPTIMIZATION"
echo "=========================================="
echo ""

# Navigate to project root
cd "$(dirname "$0")/.."

# Configuration
QUALITY=82
MAX_HERO_WIDTH=1600
MAX_CARD_WIDTH=800
MAX_THUMB_WIDTH=400

# Statistics
TOTAL_BEFORE=0
TOTAL_AFTER=0
FILES_PROCESSED=0
CONVERSIONS=()

echo "📊 Current asset size:"
CURRENT_SIZE=$(du -sh assets/images | cut -f1)
echo "   $CURRENT_SIZE (assets/images)"
echo ""

# Create backup
echo "💾 Creating backup..."
BACKUP_DIR="backups/assets_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r assets/images/* "$BACKUP_DIR/"
echo "✅ Backup created: $BACKUP_DIR"
echo ""

# Create temp directory for processing
TEMP_DIR="$(mktemp -d)"
trap "rm -rf $TEMP_DIR" EXIT

echo "🔧 Processing images..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to optimize image
optimize_image() {
    local filepath="$1"
    local filename=$(basename "$filepath")
    local dirname=$(dirname "$filepath")
    local extension="${filename##*.}"
    local basename="${filename%.*}"
    
    # Skip if already WebP
    if [[ "$extension" == "webp" ]]; then
        return
    fi
    
    # Get file size before
    local size_before=$(stat -f%z "$filepath" 2>/dev/null || stat -c%s "$filepath")
    TOTAL_BEFORE=$((TOTAL_BEFORE + size_before))
    
    # Get image dimensions
    local width=$(sips -g pixelWidth "$filepath" 2>/dev/null | grep pixelWidth | awk '{print $2}')
    local height=$(sips -g pixelHeight "$filepath" 2>/dev/null | grep pixelHeight | awk '{print $2}')
    
    echo "📸 $filename"
    echo "   Original: ${width}x${height} ($(numfmt --to=iec-i --suffix=B $size_before))"
    
    # Determine target width based on image type
    local target_width=$MAX_HERO_WIDTH
    
    # Smart sizing based on filename patterns
    if [[ "$filename" =~ (thumb|icon|logo|avatar) ]]; then
        target_width=$MAX_THUMB_WIDTH
    elif [[ "$filename" =~ (card|listing|preview) ]]; then
        target_width=$MAX_CARD_WIDTH
    fi
    
    # Create temporary resized file if needed
    local temp_file="$TEMP_DIR/${basename}.temp.${extension}"
    
    if [ "$width" -gt "$target_width" ]; then
        echo "   ↓ Resizing to max width: ${target_width}px"
        sips -Z "$target_width" "$filepath" --out "$temp_file" > /dev/null 2>&1
    else
        cp "$filepath" "$temp_file"
    fi
    
    # Convert to WebP
    local webp_file="${dirname}/${basename}.webp"
    
    if [[ "$extension" == "png" ]]; then
        # PNG: preserve transparency
        cwebp -q $QUALITY -alpha_q 100 -m 6 "$temp_file" -o "$webp_file" > /dev/null 2>&1
    else
        # JPG: standard conversion
        cwebp -q $QUALITY -m 6 "$temp_file" -o "$webp_file" > /dev/null 2>&1
    fi
    
    # Get new size
    local size_after=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file")
    TOTAL_AFTER=$((TOTAL_AFTER + size_after))
    
    local reduction=$(echo "scale=1; 100 - ($size_after * 100 / $size_before)" | bc)
    
    echo "   ✓ Converted: $(numfmt --to=iec-i --suffix=B $size_after) (${reduction}% smaller)"
    
    # Remove original
    rm "$filepath"
    
    # Track conversion
    CONVERSIONS+=("$filepath → ${basename}.webp")
    FILES_PROCESSED=$((FILES_PROCESSED + 1))
    
    echo ""
}

# Process all images
find assets/images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r file; do
    optimize_image "$file"
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ OPTIMIZATION COMPLETE!"
echo ""
echo "📊 Statistics:"
echo "   Files processed: $FILES_PROCESSED"
echo "   Size before: $(numfmt --to=iec-i --suffix=B $TOTAL_BEFORE)"
echo "   Size after: $(numfmt --to=iec-i --suffix=B $TOTAL_AFTER)"

if [ $TOTAL_BEFORE -gt 0 ]; then
    REDUCTION=$(echo "scale=1; 100 - ($TOTAL_AFTER * 100 / $TOTAL_BEFORE)" | bc)
    SAVED=$((TOTAL_BEFORE - TOTAL_AFTER))
    echo "   Reduction: ${REDUCTION}%"
    echo "   Space saved: $(numfmt --to=iec-i --suffix=B $SAVED)"
fi

echo ""
echo "📁 New asset size:"
NEW_SIZE=$(du -sh assets/images | cut -f1)
echo "   $NEW_SIZE (assets/images)"
echo ""
echo "💾 Backup location: $BACKUP_DIR"
echo ""
echo "⚠️  NEXT STEP: Update asset references in code"
echo "   Run: ./scripts/update_asset_references.sh"
echo ""
