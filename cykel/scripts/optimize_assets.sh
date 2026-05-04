#!/bin/bash

# CYKEL Asset Optimization Script
# This script compresses large images to reduce app bundle size

echo "🎨 CYKEL Asset Optimization"
echo "================================"
echo ""

# Check if required tools are installed
if ! command -v pngquant &> /dev/null && ! command -v cwebp &> /dev/null; then
    echo "⚠️  Installing optimization tools..."
    brew install pngquant webp
fi

cd "$(dirname "$0")/../assets/images" || exit 1

echo "📊 Current asset sizes:"
du -sh .
echo ""

# Create backup directory
mkdir -p ../../backups/original_assets
echo "💾 Backing up original assets..."
cp -r . ../../backups/original_assets/
echo "✅ Backup created at backups/original_assets/"
echo ""

echo "🔧 Optimizing JPG files..."
echo "--------------------------------"

# List of large JPG files to optimize
jpg_files=(
    "medium-shot-people-travel-agency.jpg"
    "eventhero.jpg"
    "bikes-rent-street (1).jpg"
    "paris-france-city-bicycles-bike-rental-bicycle-parking.jpg"
    "close-up-young-businessman-bike-shop.jpg"
    "buddymatch.jpg"
    "charging.jpg"
    "OIUFKE0.jpg"
    "challenges .jpg"
    "bike-repair-cable-maintenance-man-workshop-frame-building-professional-engineering-assessment-bicycle-transportation-with-mechanic-technician-startup-restoration.jpg"
    "man-sitting-grass-his-mountain-bike.jpg"
    "mechanic-repairing-bicycle.jpg"
    "subscriptionhero.jpg"
    "bikeshare.jpg"
)

for img in "${jpg_files[@]}"; do
    if [ -f "$img" ]; then
        echo "  Processing: $img"
        original_size=$(du -h "$img" | cut -f1)
        
        # Convert to WebP with 85% quality (excellent quality, much smaller)
        cwebp -q 85 "$img" -o "${img%.jpg}.webp" 2>/dev/null
        
        new_size=$(du -h "${img%.jpg}.webp" | cut -f1)
        echo "    ✓ $original_size → $new_size (WebP)"
        
        # Remove original JPG
        rm "$img"
    fi
done

echo ""
echo "🔧 Optimizing PNG files..."
echo "--------------------------------"

for img in *.png; do
    if [ -f "$img" ]; then
        echo "  Processing: $img"
        original_size=$(du -h "$img" | cut -f1)
        
        # Compress PNG with pngquant (65-80% quality)
        pngquant --quality=65-80 --force --skip-if-larger --output "$img" "$img" 2>/dev/null
        
        # Also create WebP version
        cwebp -q 85 "$img" -o "${img%.png}.webp" 2>/dev/null
        
        new_size=$(du -h "$img" | cut -f1)
        echo "    ✓ Compressed: $original_size → $new_size"
    fi
done

echo ""
echo "🎬 Checking video files..."
cd ../videos
if [ -f "intro.mp4" ]; then
    video_size=$(du -h intro.mp4 | cut -f1)
    echo "  Video size: $video_size"
    echo "  ℹ️  Consider compressing with: ffmpeg -i intro.mp4 -vcodec h264 -b:v 1000k intro_compressed.mp4"
fi

cd ..
echo ""
echo "✅ Optimization complete!"
echo ""
echo "📊 New asset sizes:"
du -sh images/
du -sh videos/
echo ""
echo "🔍 Total bundle size:"
du -sh .
echo ""

echo "================================"
echo "IMPORTANT: Update Flutter code to use .webp extensions"
echo ""
echo "Example:"
echo "  Before: Image.asset('assets/images/hero.jpg')"
echo "  After:  Image.asset('assets/images/hero.webp')"
echo ""
echo "Or use automatic extension detection in pubspec.yaml"
echo "================================"
