#!/usr/bin/env node

/**
 * 📦 Dependency Optimization Script
 * Analyzes and optimizes package dependencies for better performance
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, silent = false) {
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' });
    return result;
  } catch (error) {
    if (!silent) {
      log(`Error executing: ${command}`, 'red');
      log(error.message, 'red');
    }
    return null;
  }
}

async function analyzeDependencies() {
  log('📦 Starting Dependency Analysis...', 'blue');
  
  // Read package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ package.json not found!', 'red');
    process.exit(1);
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  
  log(`📊 Found ${Object.keys(dependencies).length} dependencies`, 'cyan');
  log(`📊 Found ${Object.keys(devDependencies).length} dev dependencies`, 'cyan');
  
  return { packageJson, dependencies, devDependencies };
}

async function checkUnusedDependencies() {
  log('\n🔍 Checking for unused dependencies...', 'yellow');
  
  // Check if depcheck is available
  try {
    execCommand('npx depcheck --version', true);
  } catch (error) {
    log('Installing depcheck...', 'yellow');
    execCommand('npm install -g depcheck');
  }
  
  // Run depcheck
  const depcheckResult = execCommand('npx depcheck --json', true);
  if (depcheckResult) {
    try {
      const analysis = JSON.parse(depcheckResult);
      
      if (analysis.dependencies && analysis.dependencies.length > 0) {
        log('📋 Unused dependencies found:', 'yellow');
        analysis.dependencies.forEach(dep => {
          log(`  - ${dep}`, 'red');
        });
        
        // Create removal script
        const removalScript = `npm uninstall ${analysis.dependencies.join(' ')}`;
        fs.writeFileSync('remove-unused-deps.sh', `#!/bin/bash\n${removalScript}\n`);
        log('💾 Created remove-unused-deps.sh script', 'green');
      } else {
        log('✅ No unused dependencies found!', 'green');
      }
      
      if (analysis.devDependencies && analysis.devDependencies.length > 0) {
        log('📋 Unused dev dependencies found:', 'yellow');
        analysis.devDependencies.forEach(dep => {
          log(`  - ${dep}`, 'red');
        });
      }
      
    } catch (parseError) {
      log('❌ Error parsing depcheck results', 'red');
    }
  }
}

async function checkOutdatedPackages() {
  log('\n📅 Checking for outdated packages...', 'yellow');
  
  const outdatedResult = execCommand('npm outdated --json', true);
  if (outdatedResult) {
    try {
      const outdated = JSON.parse(outdatedResult);
      const outdatedPackages = Object.keys(outdated);
      
      if (outdatedPackages.length > 0) {
        log('📋 Outdated packages found:', 'yellow');
        outdatedPackages.forEach(pkg => {
          const info = outdated[pkg];
          log(`  - ${pkg}: ${info.current} → ${info.latest}`, 'cyan');
        });
        
        // Create update script
        const updateScript = `npm update ${outdatedPackages.join(' ')}`;
        fs.writeFileSync('update-packages.sh', `#!/bin/bash\n${updateScript}\n`);
        log('💾 Created update-packages.sh script', 'green');
      } else {
        log('✅ All packages are up to date!', 'green');
      }
    } catch (parseError) {
      log('ℹ️  No outdated packages or parsing error', 'yellow');
    }
  }
}

async function analyzeBundleSize() {
  log('\n📊 Analyzing bundle size...', 'yellow');
  
  // Check if webpack-bundle-analyzer is available
  const hasAnalyzer = execCommand('npm list webpack-bundle-analyzer', true);
  if (!hasAnalyzer) {
    log('Installing webpack-bundle-analyzer...', 'yellow');
    execCommand('npm install --save-dev webpack-bundle-analyzer');
  }
  
  // Create bundle analysis script
  const analysisScript = `
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: (config) => {
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'bundle-analysis.html'
        })
      );
    }
    return config;
  }
};
`;
  
  fs.writeFileSync('next.config.analyzer.js', analysisScript);
  log('💾 Created bundle analyzer configuration', 'green');
  
  // Add script to package.json
  const { packageJson } = await analyzeDependencies();
  if (!packageJson.scripts) packageJson.scripts = {};
  packageJson.scripts['analyze'] = 'ANALYZE=true npm run build';
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  log('✅ Added analyze script to package.json', 'green');
}

async function optimizePackageJson() {
  log('\n🔧 Optimizing package.json...', 'yellow');
  
  const { packageJson } = await analyzeDependencies();
  
  // Add optimization fields
  if (!packageJson.engines) {
    packageJson.engines = {
      node: '>=18.0.0',
      npm: '>=8.0.0'
    };
    log('✅ Added engines field', 'green');
  }
  
  // Add performance budgets
  if (!packageJson.bundlesize) {
    packageJson.bundlesize = [
      {
        path: '.next/static/js/*.js',
        maxSize: '250kb'
      },
      {
        path: '.next/static/css/*.css',
        maxSize: '50kb'
      }
    ];
    log('✅ Added bundle size budgets', 'green');
  }
  
  // Sort dependencies alphabetically
  if (packageJson.dependencies) {
    const sortedDeps = {};
    Object.keys(packageJson.dependencies).sort().forEach(key => {
      sortedDeps[key] = packageJson.dependencies[key];
    });
    packageJson.dependencies = sortedDeps;
  }
  
  if (packageJson.devDependencies) {
    const sortedDevDeps = {};
    Object.keys(packageJson.devDependencies).sort().forEach(key => {
      sortedDevDeps[key] = packageJson.devDependencies[key];
    });
    packageJson.devDependencies = sortedDevDeps;
  }
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  log('✅ Optimized package.json structure', 'green');
}

async function createOptimizationReport() {
  log('\n📄 Creating optimization report...', 'yellow');
  
  const report = `# 📦 Dependency Optimization Report

Generated on: ${new Date().toISOString()}

## 🎯 Optimization Actions Taken

### 1. Dependency Analysis
- ✅ Analyzed unused dependencies
- ✅ Checked for outdated packages
- ✅ Created removal/update scripts

### 2. Bundle Analysis
- ✅ Added webpack bundle analyzer
- ✅ Created analyze script
- ✅ Set performance budgets

### 3. Package.json Optimization
- ✅ Added engines field
- ✅ Sorted dependencies alphabetically
- ✅ Added bundle size budgets

## 🚀 Next Steps

1. **Remove unused dependencies:**
   \`\`\`bash
   ./remove-unused-deps.sh
   \`\`\`

2. **Update outdated packages:**
   \`\`\`bash
   ./update-packages.sh
   \`\`\`

3. **Analyze bundle size:**
   \`\`\`bash
   npm run analyze
   \`\`\`

4. **Clean npm cache:**
   \`\`\`bash
   npm cache clean --force
   \`\`\`

## 📊 Performance Monitoring

- Monitor bundle size with: \`npm run analyze\`
- Check dependency health with: \`npm audit\`
- Update dependencies regularly: \`npm outdated\`

---
*Generated by dependency optimization script*
`;
  
  fs.writeFileSync('DEPENDENCY_OPTIMIZATION_REPORT.md', report);
  log('💾 Created optimization report', 'green');
}

async function main() {
  try {
    log('🚀 Starting Dependency Optimization Process...', 'magenta');
    
    await analyzeDependencies();
    await checkUnusedDependencies();
    await checkOutdatedPackages();
    await analyzeBundleSize();
    await optimizePackageJson();
    await createOptimizationReport();
    
    log('\n🎉 Dependency optimization completed!', 'green');
    log('📄 Check DEPENDENCY_OPTIMIZATION_REPORT.md for details', 'cyan');
    
  } catch (error) {
    log(`❌ Error during optimization: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the optimization
main();
