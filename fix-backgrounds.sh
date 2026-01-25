#!/bin/bash

# Fix all page backgrounds to use theme-aware classes

# Blue backgrounds
sed -i '' 's/bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900/page-bg-blue/g' src/app/ar/*/page.tsx src/app/ar/page.tsx
sed -i '' 's/bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900/page-bg-blue/g' src/app/ar/*/page.tsx src/app/ar/page.tsx

# Purple backgrounds  
sed -i '' 's/bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900/page-bg-purple/g' src/app/ar/*/page.tsx src/app/ar/page.tsx

# Yellow/Orange backgrounds
sed -i '' 's/bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-yellow-900\/20 dark:to-orange-900\/20/page-bg-yellow/g' src/app/ar/*/page.tsx src/app/ar/page.tsx

# Generic backgrounds
sed -i '' 's/bg-gradient-to-b from-background to-muted\/20/page-background/g' src/app/ar/*/page.tsx src/app/ar/page.tsx

echo "✅ All page backgrounds fixed!"

