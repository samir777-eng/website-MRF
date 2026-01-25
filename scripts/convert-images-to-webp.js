#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts images to WebP format for better performance
 * 
 * Usage: node scripts/convert-images-to-webp.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '../public'),
  outputDir: path.join(__dirname, '../public/optimized'),
  quality: 80,
  supportedFormats: ['.jpg', '.jpeg', '.png'],
  skipDirs: ['node_modules', '.next', '.git'],
};

// Statistics
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  totalOriginalSize: 0,
  totalOptimizedSize: 0,
};

/**
 * Check if directory should be skipped
 */
function shouldSkipDir(dirName) {
  return CONFIG.skipDirs.some(skip => dirName.includes(skip));
}

/**
 * Get all image files recursively
 */
function getImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!shouldSkipDir(file)) {
        getImageFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (CONFIG.supportedFormats.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Convert image to WebP
 */
async function convertToWebP(inputPath) {
  try {
    const relativePath = path.relative(CONFIG.inputDir, inputPath);
    const outputPath = path.join(
      CONFIG.outputDir,
      relativePath.replace(path.extname(relativePath), '.webp')
    );

    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get original file size
    const originalSize = fs.statSync(inputPath).size;

    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality: CONFIG.quality })
      .toFile(outputPath);

    // Get optimized file size
    const optimizedSize = fs.statSync(outputPath).size;

    // Update statistics
    stats.processed++;
    stats.totalOriginalSize += originalSize;
    stats.totalOptimizedSize += optimizedSize;

    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
    console.log(`✓ ${relativePath} → ${path.basename(outputPath)} (${savings}% smaller)`);

    return true;
  } catch (error) {
    stats.errors++;
    console.error(`✗ Error converting ${inputPath}:`, error.message);
    return false;
  }
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Main function
 */
async function main() {
  console.log('🖼️  Image Optimization Script');
  console.log('================================\n');

  // Check if sharp is installed
  try {
    require.resolve('sharp');
  } catch (e) {
    console.error('❌ Error: sharp is not installed.');
    console.error('Please run: npm install sharp');
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  // Get all image files
  console.log(`📁 Scanning ${CONFIG.inputDir}...\n`);
  const imageFiles = getImageFiles(CONFIG.inputDir);

  if (imageFiles.length === 0) {
    console.log('No images found to convert.');
    return;
  }

  console.log(`Found ${imageFiles.length} images to convert.\n`);

  // Convert all images
  for (const imagePath of imageFiles) {
    await convertToWebP(imagePath);
  }

  // Print statistics
  console.log('\n================================');
  console.log('📊 Conversion Statistics');
  console.log('================================');
  console.log(`✓ Processed: ${stats.processed}`);
  console.log(`⊘ Skipped: ${stats.skipped}`);
  console.log(`✗ Errors: ${stats.errors}`);
  console.log(`📦 Original Size: ${formatBytes(stats.totalOriginalSize)}`);
  console.log(`📦 Optimized Size: ${formatBytes(stats.totalOptimizedSize)}`);
  
  if (stats.totalOriginalSize > 0) {
    const totalSavings = ((stats.totalOriginalSize - stats.totalOptimizedSize) / stats.totalOriginalSize * 100).toFixed(2);
    console.log(`💾 Total Savings: ${totalSavings}%`);
  }

  console.log('\n✅ Image optimization complete!');
  console.log(`\nOptimized images are in: ${CONFIG.outputDir}`);
  console.log('\nNext steps:');
  console.log('1. Review the optimized images');
  console.log('2. Replace original images with optimized versions');
  console.log('3. Update image references in your code to use .webp format');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

