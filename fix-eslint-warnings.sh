#!/bin/bash

# Script to automatically fix common ESLint warnings

echo "🔧 Fixing ESLint warnings..."

# Fix 1: Rename useItem to applyItem in RewardsSystem.tsx
echo "Fixing React Hook naming violation..."
sed -i '' 's/const useItem = /const applyItem = /g' src/components/gamification/RewardsSystem.tsx
sed -i '' 's/useItem(/applyItem(/g' src/components/gamification/RewardsSystem.tsx

# Fix 2: Replace <a> tags with Link in homepage
echo "Fixing HTML link violations..."
# This needs manual fixing as it requires importing Link component

# Fix 3: Fix unescaped quotes
echo "Fixing unescaped entities..."
sed -i '' 's/"\([^"]*\)"/\&ldquo;\1\&rdquo;/g' src/app/ar/page.tsx 2>/dev/null || true

# Fix 4: Change let to const where appropriate
echo "Fixing prefer-const violations..."
sed -i '' 's/let requiredXP =/const requiredXP =/g' src/lib/dev-tools/error-logger.ts

echo "✅ Automatic fixes applied!"
echo "⚠️  Some fixes require manual intervention:"
echo "  - Replace <a> tags with Next.js <Link> components"
echo "  - Review and remove unused imports"
echo "  - Add missing dependencies to useEffect arrays"

