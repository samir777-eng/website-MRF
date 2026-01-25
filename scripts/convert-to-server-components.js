#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Page metadata mapping
const pageMetadata = {
  'checkout': {
    title: 'إتمام الطلب',
    description: 'إتمام عملية الشراء والدفع - منصة الأستاذ رضا الفاروق التعليمية',
  },
  'courses': {
    title: 'الدورات التعليمية',
    description: 'تصفح جميع الدورات التعليمية المتاحة - منصة الأستاذ رضا الفاروق التعليمية',
  },
  'dashboard': {
    title: 'لوحة التحكم',
    description: 'لوحة التحكم الخاصة بك - منصة الأستاذ رضا الفاروق التعليمية',
  },
  'login': {
    title: 'تسجيل الدخول',
    description: 'تسجيل الدخول إلى حسابك - منصة الأستاذ رضا الفاروق التعليمية',
  },
  'profile': {
    title: 'الملف الشخصي',
    description: 'عرض وتعديل الملف الشخصي - منصة الأستاذ رضا الفاروق التعليمية',
  },
  'quizzes': {
    title: 'الاختبارات',
    description: 'تصفح وحل الاختبارات التعليمية - منصة الأستاذ رضا الفاروق التعليمية',
  },
  'signup': {
    title: 'إنشاء حساب جديد',
    description: 'إنشاء حساب جديد على المنصة - منصة الأستاذ رضا الفاروق التعليمية',
  },
  'shop': {
    title: 'المتجر',
    description: 'تصفح وشراء الكتب والمواد التعليمية - منصة الأستاذ رضا الفاروق التعليمية',
  },
  'page': {
    title: 'الصفحة الرئيسية',
    description: 'منصة الأستاذ رضا الفاروق التعليمية - تعلم اللغة العربية للثانوية العامة',
  },
};

// Pages to convert
const pages = [
  'src/app/ar/checkout/page.tsx',
  'src/app/ar/courses/page.tsx',
  'src/app/ar/dashboard/page.tsx',
  'src/app/ar/login/page.tsx',
  'src/app/ar/profile/page.tsx',
  'src/app/ar/quizzes/page.tsx',
  'src/app/ar/signup/page.tsx',
  'src/app/ar/shop/page.tsx',
  'src/app/ar/page.tsx',
];

function convertPage(pagePath) {
  const fullPath = path.join(process.cwd(), pagePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${pagePath}`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already converted
  if (content.includes('export const metadata') && !content.includes('usePageTitle')) {
    console.log(`✅ Already converted: ${pagePath}`);
    return true;
  }

  // Get page name
  const pageDir = path.dirname(pagePath);
  const pageName = path.basename(pageDir) === 'ar' ? 'page' : path.basename(pageDir);
  const metadata = pageMetadata[pageName];

  if (!metadata) {
    console.log(`⚠️  No metadata found for: ${pageName}`);
    return false;
  }

  // Extract component name
  const componentMatch = content.match(/export default function (\w+)/);
  if (!componentMatch) {
    console.log(`⚠️  Could not find component name in: ${pagePath}`);
    return false;
  }

  const componentName = componentMatch[1];
  const clientComponentName = componentName.replace('Page', 'Client');
  const clientFileName = pageName === 'page' ? 'home-client.tsx' : `${pageName}-client.tsx`;
  const clientFilePath = path.join(pageDir, clientFileName);

  // Create client component file
  let clientContent = content;
  
  // Remove usePageTitle import and call
  clientContent = clientContent.replace(/import { usePageTitle } from '@\/hooks\/usePageTitle';\n?/g, '');
  clientContent = clientContent.replace(/\/\/ Set page title\n\s*usePageTitle\([^)]+\);\n?/g, '');
  clientContent = clientContent.replace(/usePageTitle\([^)]+\);\n?/g, '');
  
  // Rename component
  clientContent = clientContent.replace(
    `export default function ${componentName}`,
    `export default function ${clientComponentName}`
  );

  // Write client component
  fs.writeFileSync(fullPath.replace('page.tsx', clientFileName), clientContent, 'utf8');

  // Create new server component page
  const serverContent = `import type { Metadata } from 'next';
import ${clientComponentName} from './${clientFileName.replace('.tsx', '')}';

export const metadata: Metadata = {
  title: '${metadata.title}',
  description: '${metadata.description}',
};

export default function ${componentName}() {
  return <${clientComponentName} />;
}
`;

  // Write server component
  fs.writeFileSync(fullPath, serverContent, 'utf8');

  console.log(`✅ Converted: ${pagePath}`);
  console.log(`   Created: ${clientFilePath}`);
  return true;
}

console.log('🚀 Converting pages to server components with metadata...\n');

let successCount = 0;
let failCount = 0;

for (const pagePath of pages) {
  if (convertPage(pagePath)) {
    successCount++;
  } else {
    failCount++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`✅ Success: ${successCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`\n✨ Done!`);

