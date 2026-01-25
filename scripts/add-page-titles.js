#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Page titles mapping
const pageTitles = {
  'checkout': 'إتمام الطلب',
  'courses': 'الدورات التعليمية',
  'dashboard': 'لوحة التحكم',
  'login': 'تسجيل الدخول',
  'profile': 'الملف الشخصي',
  'quizzes': 'الاختبارات',
  'signup': 'إنشاء حساب جديد',
  'shop': 'المتجر',
};

// Pages to update
const pages = [
  'src/app/ar/checkout/page.tsx',
  'src/app/ar/courses/page.tsx',
  'src/app/ar/dashboard/page.tsx',
  'src/app/ar/login/page.tsx',
  'src/app/ar/profile/page.tsx',
  'src/app/ar/quizzes/page.tsx',
  'src/app/ar/signup/page.tsx',
  'src/app/ar/shop/page.tsx',
];

function addPageTitle(filePath, pageTitle) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already has usePageTitle
  if (content.includes('usePageTitle')) {
    console.log(`✅ Already has usePageTitle: ${filePath}`);
    return true;
  }

  // Check if it's a client component
  if (!content.includes("'use client'") && !content.includes('"use client"')) {
    console.log(`⚠️  Not a client component: ${filePath}`);
    return false;
  }

  // Add import for usePageTitle
  const importRegex = /(["']use client["'];?\s*\n\n)(import .+\n)+/;
  const match = content.match(importRegex);
  
  if (match) {
    const lastImportIndex = match[0].lastIndexOf('\n');
    const beforeLastImport = content.substring(0, match.index + lastImportIndex);
    const afterLastImport = content.substring(match.index + lastImportIndex);
    
    content = beforeLastImport + 
              `\nimport { usePageTitle } from '@/hooks/usePageTitle';` +
              afterLastImport;
  } else {
    // Fallback: add after 'use client'
    content = content.replace(
      /(["']use client["'];?\s*\n)/,
      `$1\nimport { usePageTitle } from '@/hooks/usePageTitle';\n`
    );
  }

  // Add usePageTitle call in the component
  const componentRegex = /export default function \w+\([^)]*\) \{/;
  const componentMatch = content.match(componentRegex);
  
  if (componentMatch) {
    const insertIndex = componentMatch.index + componentMatch[0].length;
    const before = content.substring(0, insertIndex);
    const after = content.substring(insertIndex);
    
    content = before + 
              `\n  // Set page title\n  usePageTitle('${pageTitle}');\n` +
              after;
  }

  // Write the updated content
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Added usePageTitle to: ${filePath}`);
  return true;
}

console.log('🚀 Adding page titles to all pages...\n');

let successCount = 0;
let failCount = 0;

for (const pagePath of pages) {
  const pageName = path.basename(path.dirname(pagePath));
  const pageTitle = pageTitles[pageName] || pageName;
  
  if (addPageTitle(pagePath, pageTitle)) {
    successCount++;
  } else {
    failCount++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`✅ Success: ${successCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`\n✨ Done!`);

