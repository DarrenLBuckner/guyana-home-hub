#!/bin/bash

echo "🔍 Checking for improper useCountryTheme usage..."

hasErrors=false

# Find files that import useCountryTheme but don't call it properly
find src/ -name "*.tsx" -o -name "*.ts" | while read -r file; do
    
    # Check if the file has the hook imported
    if grep -q "import.*useCountryTheme" "$file"; then
        
        # Check if it's used without parentheses (common mistake)
        if grep -q "= useCountryTheme;" "$file"; then
            echo "❌ ERROR in $file: useCountryTheme called without ()"
            echo "   Fix: const { theme } = useCountryTheme();"
            echo ""
            hasErrors=true
        fi
        
        # Check if 'use client' is missing in client components
        if ! grep -q "'use client'" "$file" && ! grep -q '"use client"' "$file"; then
            echo "⚠️  WARNING in $file: Missing 'use client' directive"
            echo "   Add: 'use client' at the top of the file"
            echo ""
        fi
        
        # Check for rendering theme object directly
        if grep -q "{theme}" "$file"; then
            echo "❌ ERROR in $file: Rendering theme object directly"
            echo "   Fix: Use {theme.name} or other specific properties"
            echo ""
            hasErrors=true
        fi
    fi
done

if [ "$hasErrors" = true ]; then
    echo "❌ Theme usage check failed. Please fix the errors above."
    exit 1
else
    echo "✅ Theme usage check complete - No issues found!"
fi