#!/usr/bin/env node

/**
 * Script to fix navigation test selectors across all test files
 * Changes: page.locator('[role="navigation"]') to page.locator('[role="navigation"]').first()
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixNavigationTests(filePath) {
  console.log(`Processing: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern 1: Fix navigation locator without .first()
  const pattern1 = /const nav = page\.locator\('\[role="navigation"\]'\);/g;
  if (pattern1.test(content)) {
    content = content.replace(pattern1, `const nav = page.locator('[role="navigation"]').first();`);
    modified = true;
  }

  // Pattern 2: Fix direct navigation expectations
  const pattern2 = /await expect\(page\.locator\('\[role="navigation"\]'\)\)\.toBeVisible\(\);/g;
  if (pattern2.test(content)) {
    content = content.replace(pattern2, `await expect(page.locator('[role="navigation"]').first()).toBeVisible();`);
    modified = true;
  }

  // Pattern 3: Fix URL expectations from /cart to /ar/cart
  const urlPattern = /await expect\(page\)\.toHaveURL\('\/([^']+)'\);/g;
  const matches = content.match(urlPattern);
  if (matches) {
    matches.forEach(match => {
      const urlMatch = match.match(/toHaveURL\('\/([^']+)'\)/);
      if (urlMatch && !urlMatch[1].startsWith('ar/')) {
        const newUrl = `/ar/${urlMatch[1]}`;
        const newMatch = match.replace(/toHaveURL\('\/[^']+'\)/, `toHaveURL('${newUrl}')`);
        content = content.replace(match, newMatch);
        modified = true;
      }
    });
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${path.basename(filePath)}`);
    return true;
  } else {
    console.log(`⏭️  No changes needed: ${path.basename(filePath)}`);
    return false;
  }
}

function main() {
  console.log('🔧 Fixing navigation tests across all test files...\n');
  
  const testDir = path.join(__dirname, '../tests/ultra-comprehensive');
  const testFiles = glob.sync(`${testDir}/**/*.spec.ts`);
  
  let totalFixed = 0;
  
  testFiles.forEach(filePath => {
    if (fixNavigationTests(filePath)) {
      totalFixed++;
    }
  });

  console.log(`\n✨ Complete! Fixed ${totalFixed} files.`);
}

main();

