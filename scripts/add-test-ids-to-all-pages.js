#!/usr/bin/env node

/**
 * Script to add data-testid and aria-label attributes to all interactive elements
 * across all client component pages
 */

import fs from 'fs';
import path from 'path';

// Map of pages to their expected buttons, links, and forms
const pageConfigurations = {
  'checkout-client.tsx': {
    buttons: [
      { name: 'إتمام الطلب', testId: 'complete-order', ariaLabel: 'إتمام الطلب' },
      { name: 'العودة للسلة', testId: 'back-to-cart', ariaLabel: 'العودة للسلة' },
      { name: 'تطبيق', testId: 'apply-coupon', ariaLabel: 'تطبيق كوبون' },
    ],
    forms: [
      { name: 'checkoutForm', fields: ['name', 'email', 'phone', 'address', 'city', 'postalCode'] },
    ],
  },
  'login-client.tsx': {
    buttons: [
      { name: 'تسجيل الدخول', testId: 'login', ariaLabel: 'تسجيل الدخول' },
      { name: 'نسيت كلمة المرور', testId: 'forgot-password', ariaLabel: 'نسيت كلمة المرور' },
    ],
    links: [
      { name: 'إنشاء حساب جديد', testId: 'signup-link', href: '/ar/signup' },
    ],
    forms: [
      { name: 'loginForm', fields: ['email', 'password'] },
    ],
  },
  'signup-client.tsx': {
    buttons: [
      { name: 'إنشاء حساب', testId: 'signup', ariaLabel: 'إنشاء حساب' },
    ],
    links: [
      { name: 'تسجيل الدخول', testId: 'login-link', href: '/ar/login' },
    ],
    forms: [
      { name: 'signupForm', fields: ['name', 'email', 'password', 'confirmPassword'] },
    ],
  },
  'profile-client.tsx': {
    buttons: [
      { name: 'حفظ التغييرات', testId: 'save-profile', ariaLabel: 'حفظ التغييرات' },
      { name: 'تغيير كلمة المرور', testId: 'change-password', ariaLabel: 'تغيير كلمة المرور' },
      { name: 'تسجيل الخروج', testId: 'logout', ariaLabel: 'تسجيل الخروج' },
    ],
    forms: [
      { name: 'profileForm', fields: ['name', 'email', 'phone', 'bio'] },
    ],
  },
  'dashboard-client.tsx': {
    buttons: [
      { name: 'عرض الكل', testId: 'view-all-courses', ariaLabel: 'عرض جميع الدورات' },
      { name: 'متابعة الدرس', testId: 'continue-lesson', ariaLabel: 'متابعة الدرس' },
      { name: 'بدء الاختبار', testId: 'start-quiz', ariaLabel: 'بدء الاختبار' },
    ],
    links: [
      { name: 'الدورات', testId: 'courses-link', href: '/ar/courses' },
      { name: 'الاختبارات', testId: 'quizzes-link', href: '/ar/quizzes' },
      { name: 'الملف الشخصي', testId: 'profile-link', href: '/ar/profile' },
    ],
  },
  'quizzes-client.tsx': {
    buttons: [
      { name: 'بدء الاختبار', testId: 'start-quiz', ariaLabel: 'بدء الاختبار' },
      { name: 'إرسال الإجابات', testId: 'submit-quiz', ariaLabel: 'إرسال الإجابات' },
      { name: 'التالي', testId: 'next-question', ariaLabel: 'السؤال التالي' },
      { name: 'السابق', testId: 'previous-question', ariaLabel: 'السؤال السابق' },
    ],
    forms: [
      { name: 'quizForm', fields: ['answer'] },
    ],
  },
  'courses-client.tsx': {
    buttons: [
      { name: 'التسجيل في الدورة', testId: 'enroll-course', ariaLabel: 'التسجيل في الدورة' },
      { name: 'عرض التفاصيل', testId: 'view-details', ariaLabel: 'عرض تفاصيل الدورة' },
      { name: 'تصفية', testId: 'filter', ariaLabel: 'تصفية الدورات' },
    ],
  },
  'shop-client.tsx': {
    buttons: [
      { name: 'إضافة للسلة', testId: 'add-to-cart', ariaLabel: 'إضافة للسلة' },
      { name: 'عرض التفاصيل', testId: 'view-details', ariaLabel: 'عرض تفاصيل المنتج' },
      { name: 'تصفية', testId: 'filter', ariaLabel: 'تصفية المنتجات' },
    ],
  },
  'home-client.tsx': {
    buttons: [
      { name: 'ابدأ الآن', testId: 'get-started', ariaLabel: 'ابدأ الآن' },
      { name: 'تصفح الدورات', testId: 'browse-courses', ariaLabel: 'تصفح الدورات' },
    ],
    links: [
      { name: 'الدورات', testId: 'courses-link', href: '/ar/courses' },
      { name: 'المتجر', testId: 'shop-link', href: '/ar/shop' },
      { name: 'من نحن', testId: 'about-link', href: '/ar/about' },
    ],
  },
};

function addTestIdsToFile(filePath, config) {
  console.log(`\nProcessing: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Add test IDs to buttons
  if (config.buttons) {
    config.buttons.forEach(button => {
      // Look for Button components with the button name
      const buttonRegex = new RegExp(
        `(<Button[^>]*>\\s*(?:<[^>]+>\\s*)*)(${button.name})`,
        'g'
      );
      
      if (buttonRegex.test(content)) {
        content = content.replace(buttonRegex, (match, before, text) => {
          // Check if already has data-testid
          if (before.includes('data-testid')) {
            return match;
          }
          // Add data-testid and aria-label before the closing >
          const updatedBefore = before.replace(
            /(<Button[^>]*)/,
            `$1\n          data-testid="${button.testId}"\n          aria-label="${button.ariaLabel}"`
          );
          modified = true;
          return updatedBefore + text;
        });
      }
    });
  }

  // Add test IDs to links
  if (config.links) {
    config.links.forEach(link => {
      const linkRegex = new RegExp(
        `(<Link[^>]*href=["']${link.href}["'][^>]*>)`,
        'g'
      );
      
      if (linkRegex.test(content)) {
        content = content.replace(linkRegex, (match) => {
          if (match.includes('data-testid')) {
            return match;
          }
          const updated = match.replace(
            /(<Link[^>]*)/,
            `$1 data-testid="${link.testId}"`
          );
          modified = true;
          return updated;
        });
      }
    });
  }

  // Add test IDs to form fields
  if (config.forms) {
    config.forms.forEach(form => {
      form.fields.forEach(field => {
        // Look for Input components with name attribute
        const inputRegex = new RegExp(
          `(<Input[^>]*name=["']${field}["'][^>]*)(/?>)`,
          'g'
        );
        
        if (inputRegex.test(content)) {
          content = content.replace(inputRegex, (match, before, end) => {
            if (before.includes('data-testid')) {
              return match;
            }
            modified = true;
            return `${before} data-testid="${field}"${end}`;
          });
        }

        // Also look for input elements
        const htmlInputRegex = new RegExp(
          `(<input[^>]*name=["']${field}["'][^>]*)(/?>)`,
          'g'
        );
        
        if (htmlInputRegex.test(content)) {
          content = content.replace(htmlInputRegex, (match, before, end) => {
            if (before.includes('data-testid')) {
              return match;
            }
            modified = true;
            return `${before} data-testid="${field}"${end}`;
          });
        }
      });
    });
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${path.basename(filePath)}`);
    return true;
  } else {
    console.log(`⏭️  No changes needed: ${path.basename(filePath)}`);
    return false;
  }
}

function main() {
  console.log('🚀 Adding test IDs to all client component pages...\n');
  
  const clientComponentsDir = path.join(__dirname, '../src/app/ar');
  let totalUpdated = 0;

  Object.keys(pageConfigurations).forEach(fileName => {
    const config = pageConfigurations[fileName];
    
    // Find the file in the directory structure
    const findFile = (dir, name) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
          const found = findFile(fullPath, name);
          if (found) return found;
        } else if (file.name === name) {
          return fullPath;
        }
      }
      return null;
    };

    const filePath = findFile(clientComponentsDir, fileName);
    if (filePath) {
      if (addTestIdsToFile(filePath, config)) {
        totalUpdated++;
      }
    } else {
      console.log(`⚠️  File not found: ${fileName}`);
    }
  });

  console.log(`\n✨ Complete! Updated ${totalUpdated} files.`);
}

main();

