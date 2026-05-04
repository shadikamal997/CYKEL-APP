#!/bin/bash
# CYKEL - Batch fix all colored AppColors to monochrome black/white
# This script systematically converts colored styling across all Dart files

cd "/Users/shadi/Desktop/CYKEL/cykel" || exit 1

echo "🎨 Starting monochrome conversion..."
echo "📊 Finding all files with AppColors..."

# Find all Dart files with AppColors usage (excluding theme files)
FILES=$(grep -rl "AppColors\.\(primary\|success\|error\|warning\|info\)" lib/features --include="*.dart" | grep -v "/domain/" | grep -v "/data/")

echo "📝 Found $(echo "$FILES" | wc -l | tr -d ' ') files to update"

# For each file, we'll do targeted replacements
# Note: These are safe patterns that won't break syntax

for file in $FILES; do
    echo "Processing: $file"
    
    # Backup
    cp "$file" "$file.bak"
    
    # Simple color replacements (backgrounds, foregroundColors in buttons)
    # Pattern: backgroundColor: AppColors.primary, -> needs manual review for isDark check
    
    #sed -i '' 's/backgroundColor: AppColors\.primary,/backgroundColor: isDark ? Colors.white : Colors.black, \/\/ REVIEW/g' "$file"
    #sed -i '' 's/foregroundColor: AppColors\.primary,/foregroundColor: isDark ? Colors.black : Colors.white, \/\/ REVIEW/g' "$file"
    
done

echo "✅ Backup files created with .bak extension"
echo "⚠️  Manual review required - too many context-dependent cases"
echo ""
echo "📋 Summary of AppColors.primary|success|error|warning|info usage:"
grep -n "AppColors\.\(primary\|success\|error\|warning\|info\)" lib/features/**/*.dart | wc -l

echo ""
echo "💡 Recommended approach:"
echo "1. Fix high-priority user-facing screens first (Events, Marketplace, Activity)"
echo "2. Use multi_replace_string_in_file for each screen systematically"
echo "3. Test after each module conversion"

