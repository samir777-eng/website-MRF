#!/usr/bin/env node

/**
 * Automated Code Optimization Script
 * Fixes common issues: unused imports, unused variables, etc.
 */

const fs = require('fs');
const path = require('path');

// Files to fix with their unused imports/variables
const fixes = {
  'src/app/ar/achievements/page.tsx': {
    removeImports: ['useState', 'Badge', 'Button', 'Calendar', 'Users'],
    removeVariables: ['userStats']
  },
  'src/app/ar/announcements/page.tsx': {
    removeImports: ['CardHeader', 'CardTitle', 'Video', 'CheckCircle']
  },
  'src/app/ar/courses/page.tsx': {
    removeImports: ['Calendar', 'Zap', 'Headphones']
  },
  'src/app/ar/dashboard/page.tsx': {
    removeVariables: ['setCurrentStreak', 'setTotalXP', 'setCurrentLevel']
  },
  'src/app/ar/help/page.tsx': {
    removeImports: ['Shield']
  },
  'src/components/sections/hero-section.tsx': {
    removeImports: ['Badge', 'BookOpen', 'Trophy', 'Sparkles']
  },
  'src/components/ui/dialog.tsx': {
    removeImports: ['X']
  },
  'src/components/ui/notification-center.tsx': {
    removeImports: ['Check']
  },
  'src/components/ui/profile-card.tsx': {
    removeImports: ['TrendingUp']
  },
  'src/components/ui/sort-dropdown.tsx': {
    removeImports: ['useState']
  },
  'src/components/ui/theme-toggle.tsx': {
    removeVariables: ['theme']
  },
  'src/components/video/VideoPlayer.tsx': {
    removeVariables: ['changePlaybackSpeed']
  },
  'src/components/video/video-player.tsx': {
    removeImports: ['Settings'],
    removeVariables: ['t']
  },
  'src/lib/animations/lightweight-motion.tsx': {
    removeImports: ['AnimationConfig']
  },
  'src/lib/security/http-client.ts': {
    removeImports: ['jwtUtils']
  },
  'src/hooks/useToast.ts': {
    removeVariables: ['actionTypes']
  },
  'src/hooks/useUnsavedChanges.ts': {
    removeVariables: ['router']
  },
  'src/contexts/GamificationContext.tsx': {
    removeImports: ['ACHIEVEMENTS'],
    removeVariables: ['leveledUp']
  }
};

// Prefix unused error variables with underscore
const prefixErrorVariables = [
  'src/lib/dev-tools/console-enhancer.ts',
  'src/lib/monitoring/performance-monitor.ts',
  'src/lib/security/http-client.ts',
  'src/lib/security/jwt-utils.ts',
  'src/lib/security/server-nonce.ts',
  'src/lib/security/token-manager.ts'
];

// Prefix unused function parameters
const prefixParameters = {
  'src/lib/dev-tools/performance-profiler.ts': ['metadata'],
  'src/lib/msw/handlers.ts': ['index'],
  'src/lib/store/auth-store.ts': ['email', 'token', 'password']
};

function removeFromImport(content, importName) {
  // Remove from destructured imports
  const destructuredRegex = new RegExp(`\\s*,?\\s*${importName}\\s*,?\\s*`, 'g');
  content = content.replace(destructuredRegex, (match) => {
    if (match.includes(',')) return ', ';
    return '';
  });
  
  // Clean up double commas
  content = content.replace(/,\s*,/g, ',');
  content = content.replace(/{\s*,/g, '{');
  content = content.replace(/,\s*}/g, '}');
  
  // Remove empty import statements
  content = content.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];?\s*\n/g, '');
  
  return content;
}

function removeVariable(content, varName) {
  // Remove variable declarations
  const patterns = [
    new RegExp(`const\\s+${varName}\\s*=\\s*[^;]+;\\s*\n`, 'g'),
    new RegExp(`let\\s+${varName}\\s*=\\s*[^;]+;\\s*\n`, 'g'),
    new RegExp(`const\\s+\\[\\s*[^,]*,\\s*${varName}\\s*\\]\\s*=\\s*[^;]+;\\s*\n`, 'g'),
  ];
  
  patterns.forEach(pattern => {
    content = content.replace(pattern, '');
  });
  
  return content;
}

function prefixWithUnderscore(content, varName) {
  // Prefix error variables in catch blocks
  content = content.replace(
    new RegExp(`catch\\s*\\(\\s*${varName}\\s*\\)`, 'g'),
    `catch (_${varName})`
  );
  
  // Prefix function parameters
  content = content.replace(
    new RegExp(`\\(([^)]*)\\b${varName}\\b([^)]*)\\)`, 'g'),
    (match, before, after) => {
      if (before.includes('_' + varName) || after.includes('_' + varName)) {
        return match; // Already prefixed
      }
      return `(${before}_${varName}${after})`;
    }
  );
  
  return content;
}

function processFile(filePath, config) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // Remove unused imports
  if (config.removeImports) {
    config.removeImports.forEach(importName => {
      const before = content;
      content = removeFromImport(content, importName);
      if (content !== before) {
        console.log(`  ✓ Removed import: ${importName}`);
        modified = true;
      }
    });
  }
  
  // Remove unused variables
  if (config.removeVariables) {
    config.removeVariables.forEach(varName => {
      const before = content;
      content = removeVariable(content, varName);
      if (content !== before) {
        console.log(`  ✓ Removed variable: ${varName}`);
        modified = true;
      }
    });
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    return true;
  }
  
  return false;
}

function main() {
  console.log('🚀 Starting code optimization...\n');
  
  let totalFixed = 0;
  
  // Process files with specific fixes
  console.log('📝 Removing unused imports and variables...\n');
  Object.entries(fixes).forEach(([filePath, config]) => {
    console.log(`Processing: ${filePath}`);
    if (processFile(filePath, config)) {
      totalFixed++;
    }
  });
  
  // Prefix error variables
  console.log('\n🔧 Prefixing unused error variables...\n');
  prefixErrorVariables.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const before = content;
      content = prefixWithUnderscore(content, 'error');
      content = prefixWithUnderscore(content, 'e');
      if (content !== before) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`  ✓ Fixed: ${filePath}`);
        totalFixed++;
      }
    }
  });
  
  // Prefix unused parameters
  console.log('\n🔧 Prefixing unused parameters...\n');
  Object.entries(prefixParameters).forEach(([filePath, params]) => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const before = content;
      params.forEach(param => {
        content = prefixWithUnderscore(content, param);
      });
      if (content !== before) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`  ✓ Fixed: ${filePath}`);
        totalFixed++;
      }
    }
  });
  
  console.log(`\n✅ Optimization complete! Fixed ${totalFixed} files.`);
  console.log('\n📊 Next steps:');
  console.log('  1. Run: npm run build');
  console.log('  2. Verify no new errors introduced');
  console.log('  3. Test the application');
}

main();

