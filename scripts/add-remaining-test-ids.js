#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Configuration for each page
const pages = [
  {
    name: 'home',
    file: 'src/app/ar/home-client.tsx',
    buttons: [
      { search: 'ابدأ الآن', testId: 'cta-start-now', label: 'ابدأ الآن' },
      { search: 'معرفة المزيد', testId: 'cta-learn-more', label: 'معرفة المزيد' },
    ],
    links: [
      { search: '/about', testId: 'link-about', label: 'من نحن' },
      { search: '/courses', testId: 'link-courses', label: 'الدورات' },
      { search: '/help', testId: 'link-help', label: 'المساعدة' },
      { search: '/contact', testId: 'link-contact', label: 'اتصل بنا' },
    ]
  },
  {
    name: 'profile',
    file: 'src/app/ar/profile/profile-client.tsx',
    buttons: [
      { search: 'تحرير الملف', testId: 'edit-profile', label: 'تحرير الملف الشخصي' },
      { search: 'حفظ التغييرات', testId: 'save-changes', label: 'حفظ التغييرات' },
      { search: 'إلغاء', testId: 'cancel-edit', label: 'إلغاء' },
      { search: 'تغيير الصورة', testId: 'change-avatar', label: 'تغيير الصورة' },
      { search: 'تغيير كلمة المرور', testId: 'change-password', label: 'تغيير كلمة المرور' },
    ],
    forms: [
      { field: 'name', testId: 'name' },
      { field: 'email', testId: 'email' },
      { field: 'phone', testId: 'phone' },
      { field: 'bio', testId: 'bio' },
    ]
  },
  {
    name: 'quizzes',
    file: 'src/app/ar/quizzes/quizzes-client.tsx',
    buttons: [
      { search: 'ابدأ الاختبار', testId: 'start-quiz', label: 'ابدأ الاختبار' },
      { search: 'التالي', testId: 'next-question', label: 'التالي' },
      { search: 'السابق', testId: 'prev-question', label: 'السابق' },
      { search: 'إنهاء الاختبار', testId: 'submit-quiz', label: 'إنهاء الاختبار' },
      { search: 'مراجعة الإجابات', testId: 'review-answers', label: 'مراجعة الإجابات' },
    ],
    forms: [
      { field: 'answer', testId: 'answer' },
    ]
  },
  {
    name: 'register',
    file: 'src/app/ar/signup/signup-client.tsx',
    buttons: [
      { search: 'إنشاء حساب', testId: 'submit-register', label: 'إنشاء حساب' },
      { search: 'Google', testId: 'oauth-google', label: 'تسجيل بواسطة Google' },
      { search: 'Facebook', testId: 'oauth-facebook', label: 'تسجيل بواسطة Facebook' },
    ],
    links: [
      { search: '/login', testId: 'link-login', label: 'تسجيل الدخول' },
    ],
    forms: [
      { field: 'name', testId: 'name' },
      { field: 'email', testId: 'email' },
      { field: 'password', testId: 'password' },
      { field: 'confirmPassword', testId: 'confirmPassword' },
      { field: 'terms', testId: 'terms' },
    ]
  },
  {
    name: 'shop',
    file: 'src/app/ar/shop/shop-client.tsx',
    buttons: [
      { search: 'إضافة للسلة', testId: 'add-to-cart', label: 'إضافة للسلة' },
      { search: 'شراء الآن', testId: 'buy-now', label: 'شراء الآن' },
      { search: 'عرض السلة', testId: 'view-cart', label: 'عرض السلة' },
      { search: 'تصفية', testId: 'open-filters', label: 'تصفية' },
    ]
  }
];

console.log('🚀 Adding test IDs to remaining pages...\n');

let totalUpdates = 0;

pages.forEach(page => {
  const filePath = path.join(process.cwd(), page.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${page.name}: File not found - ${page.file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let updates = 0;

  // Add test IDs to buttons
  if (page.buttons) {
    page.buttons.forEach(btn => {
      // Pattern 1: Button with text content
      const pattern1 = new RegExp(`(<Button[^>]*>)([^<]*${btn.search}[^<]*)`, 'g');
      if (pattern1.test(content)) {
        content = content.replace(pattern1, (match, opening, text) => {
          if (!opening.includes('data-testid')) {
            const newOpening = opening.replace(
              /(<Button[^>]*)(>)/,
              `$1\n                  data-testid="${btn.testId}"\n                  aria-label="${btn.label}"$2`
            );
            updates++;
            return newOpening + text;
          }
          return match;
        });
      }
    });
  }

  // Add test IDs to links
  if (page.links) {
    page.links.forEach(link => {
      const pattern = new RegExp(`(<Link[^>]*href="${link.search}"[^>]*)(>)`, 'g');
      if (pattern.test(content)) {
        content = content.replace(pattern, (match, opening, closing) => {
          if (!opening.includes('data-testid')) {
            updates++;
            return `${opening}\n                  data-testid="${link.testId}"${closing}`;
          }
          return match;
        });
      }
    });
  }

  // Add test IDs to form fields
  if (page.forms) {
    page.forms.forEach(form => {
      const pattern = new RegExp(`(<Input[^>]*(?:id|name)="${form.field}"[^>]*)(/>|>)`, 'g');
      if (pattern.test(content)) {
        content = content.replace(pattern, (match, opening, closing) => {
          if (!opening.includes('data-testid')) {
            updates++;
            return `${opening}\n                  data-testid="${form.testId}"${closing}`;
          }
          return match;
        });
      }
    });
  }

  if (updates > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${page.name}: Added ${updates} test IDs`);
    totalUpdates += updates;
  } else {
    console.log(`ℹ️  ${page.name}: No updates needed (already has test IDs or patterns not found)`);
  }
});

console.log(`\n✨ Total: Added ${totalUpdates} test IDs across all pages`);
console.log('\n📝 Next steps:');
console.log('1. Review the changes');
console.log('2. Run tests to verify');
console.log('3. Commit the changes\n');

