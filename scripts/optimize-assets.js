#!/usr/bin/env node

/**
 * 🖼️ Asset Optimization Script
 * Optimizes images, fonts, and other static assets for better performance
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
    }
    return null;
  }
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function analyzeAssets() {
  log('🖼️ Starting Asset Analysis...', 'blue');
  
  const publicDir = path.join(process.cwd(), 'public');
  const srcDir = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(publicDir)) {
    log('❌ Public directory not found!', 'red');
    return;
  }
  
  const assetStats = {
    images: [],
    fonts: [],
    icons: [],
    other: [],
    totalSize: 0
  };
  
  function scanDirectory(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        scanDirectory(fullPath, relativePath);
      } else {
        const ext = path.extname(item).toLowerCase();
        const size = stats.size;
        assetStats.totalSize += size;
        
        const fileInfo = {
          path: relativePath,
          fullPath,
          size,
          formattedSize: formatBytes(size)
        };
        
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
          assetStats.images.push(fileInfo);
        } else if (['.woff', '.woff2', '.ttf', '.otf', '.eot'].includes(ext)) {
          assetStats.fonts.push(fileInfo);
        } else if (item.includes('icon') || ext === '.ico') {
          assetStats.icons.push(fileInfo);
        } else {
          assetStats.other.push(fileInfo);
        }
      }
    });
  }
  
  scanDirectory(publicDir);
  
  log(`📊 Asset Analysis Complete:`, 'cyan');
  log(`  Images: ${assetStats.images.length} files`, 'yellow');
  log(`  Fonts: ${assetStats.fonts.length} files`, 'yellow');
  log(`  Icons: ${assetStats.icons.length} files`, 'yellow');
  log(`  Other: ${assetStats.other.length} files`, 'yellow');
  log(`  Total Size: ${formatBytes(assetStats.totalSize)}`, 'magenta');
  
  return assetStats;
}

async function optimizeImages(assetStats) {
  log('\n🖼️ Optimizing Images...', 'yellow');
  
  if (assetStats.images.length === 0) {
    log('ℹ️  No images found to optimize', 'cyan');
    return;
  }
  
  // Check for imagemin
  try {
    execCommand('npm list imagemin', true);
  } catch (error) {
    log('Installing image optimization tools...', 'yellow');
    execCommand('npm install --save-dev imagemin imagemin-mozjpeg imagemin-pngquant imagemin-svgo imagemin-webp');
  }
  
  // Create image optimization script
  const optimizationScript = `
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminWebp = require('imagemin-webp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  console.log('🖼️ Starting image optimization...');
  
  // Optimize JPEG/JPG files
  await imagemin(['public/**/*.{jpg,jpeg}'], {
    destination: 'public/optimized',
    plugins: [
      imageminMozjpeg({ quality: 80 })
    ]
  });
  
  // Optimize PNG files
  await imagemin(['public/**/*.png'], {
    destination: 'public/optimized',
    plugins: [
      imageminPngquant({ quality: [0.6, 0.8] })
    ]
  });
  
  // Optimize SVG files
  await imagemin(['public/**/*.svg'], {
    destination: 'public/optimized',
    plugins: [
      imageminSvgo({
        plugins: [
          { removeViewBox: false },
          { removeDimensions: true }
        ]
      })
    ]
  });
  
  // Generate WebP versions
  await imagemin(['public/**/*.{jpg,jpeg,png}'], {
    destination: 'public/webp',
    plugins: [
      imageminWebp({ quality: 80 })
    ]
  });
  
  console.log('✅ Image optimization completed!');
}

optimizeImages().catch(console.error);
`;
  
  fs.writeFileSync('optimize-images.js', optimizationScript);
  log('💾 Created image optimization script', 'green');
  
  // Show large images that need attention
  const largeImages = assetStats.images.filter(img => img.size > 500000); // > 500KB
  if (largeImages.length > 0) {
    log('⚠️  Large images found (>500KB):', 'yellow');
    largeImages.forEach(img => {
      log(`  - ${img.path}: ${img.formattedSize}`, 'red');
    });
  }
}

async function optimizeFonts(assetStats) {
  log('\n🔤 Analyzing Fonts...', 'yellow');
  
  if (assetStats.fonts.length === 0) {
    log('ℹ️  No fonts found', 'cyan');
    return;
  }
  
  log('📋 Font files found:', 'cyan');
  assetStats.fonts.forEach(font => {
    log(`  - ${font.path}: ${font.formattedSize}`, 'yellow');
  });
  
  // Check for unused fonts
  const fontRecommendations = `
# 🔤 Font Optimization Recommendations

## Current Fonts
${assetStats.fonts.map(font => `- ${font.path}: ${font.formattedSize}`).join('\n')}

## Optimization Tips
1. **Use WOFF2 format** - Best compression and browser support
2. **Subset fonts** - Include only needed characters
3. **Preload critical fonts** - Add to HTML head:
   \`<link rel="preload" href="/fonts/font.woff2" as="font" type="font/woff2" crossorigin>\`
4. **Use font-display: swap** - Improve loading performance
5. **Consider system fonts** - Reduce HTTP requests

## Next.js Font Optimization
\`\`\`javascript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
\`\`\`
`;
  
  fs.writeFileSync('FONT_OPTIMIZATION.md', fontRecommendations);
  log('💾 Created font optimization guide', 'green');
}

async function optimizeIcons(assetStats) {
  log('\n🎯 Optimizing Icons...', 'yellow');
  
  if (assetStats.icons.length === 0) {
    log('ℹ️  No icons found', 'cyan');
    return;
  }
  
  log('📋 Icon files found:', 'cyan');
  assetStats.icons.forEach(icon => {
    log(`  - ${icon.path}: ${icon.formattedSize}`, 'yellow');
  });
  
  // Create icon sprite optimization script
  const iconOptimization = `
# 🎯 Icon Optimization Guide

## Current Icons
${assetStats.icons.map(icon => `- ${icon.path}: ${icon.formattedSize}`).join('\n')}

## Optimization Strategies

### 1. SVG Sprite
Combine multiple SVG icons into a single sprite:
\`\`\`bash
npx svg-sprite --mode symbol --dest public/sprites public/icons/*.svg
\`\`\`

### 2. Icon Components
Create reusable icon components:
\`\`\`jsx
const Icon = ({ name, size = 24, ...props }) => (
  <svg width={size} height={size} {...props}>
    <use href={\`/sprites/symbol.svg#\${name}\`} />
  </svg>
);
\`\`\`

### 3. Lucide React Icons
Consider using Lucide React for consistent icons:
\`\`\`bash
npm install lucide-react
\`\`\`

### 4. Icon Fonts vs SVG
- **SVG**: Better for customization, accessibility
- **Icon Fonts**: Smaller bundle size for many icons
`;
  
  fs.writeFileSync('ICON_OPTIMIZATION.md', iconOptimization);
  log('💾 Created icon optimization guide', 'green');
}

async function createAssetManifest(assetStats) {
  log('\n📄 Creating Asset Manifest...', 'yellow');
  
  const manifest = {
    generated: new Date().toISOString(),
    summary: {
      totalFiles: assetStats.images.length + assetStats.fonts.length + assetStats.icons.length + assetStats.other.length,
      totalSize: assetStats.totalSize,
      formattedSize: formatBytes(assetStats.totalSize)
    },
    breakdown: {
      images: {
        count: assetStats.images.length,
        size: assetStats.images.reduce((sum, img) => sum + img.size, 0),
        files: assetStats.images.map(img => ({
          path: img.path,
          size: img.formattedSize
        }))
      },
      fonts: {
        count: assetStats.fonts.length,
        size: assetStats.fonts.reduce((sum, font) => sum + font.size, 0),
        files: assetStats.fonts.map(font => ({
          path: font.path,
          size: font.formattedSize
        }))
      },
      icons: {
        count: assetStats.icons.length,
        size: assetStats.icons.reduce((sum, icon) => sum + icon.size, 0),
        files: assetStats.icons.map(icon => ({
          path: icon.path,
          size: icon.formattedSize
        }))
      }
    }
  };
  
  fs.writeFileSync('asset-manifest.json', JSON.stringify(manifest, null, 2));
  log('💾 Created asset manifest', 'green');
}

async function main() {
  try {
    log('🚀 Starting Asset Optimization Process...', 'magenta');
    
    const assetStats = await analyzeAssets();
    if (!assetStats) return;
    
    await optimizeImages(assetStats);
    await optimizeFonts(assetStats);
    await optimizeIcons(assetStats);
    await createAssetManifest(assetStats);
    
    log('\n🎉 Asset optimization completed!', 'green');
    log('📄 Check the generated optimization guides for next steps', 'cyan');
    
  } catch (error) {
    log(`❌ Error during asset optimization: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the optimization
main();
