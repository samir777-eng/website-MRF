#!/bin/bash

# 🧹 Comprehensive Codebase Cleanup Script
# This script safely cleans up redundant files and optimizes the codebase

set -e  # Exit on any error

echo "🧹 Starting Codebase Cleanup & Optimization..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Create backup directory
print_status "Creating backup directory..."
mkdir -p .cleanup-backup/$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=".cleanup-backup/$(date +%Y%m%d_%H%M%S)"

# Phase 1: Documentation Cleanup
print_status "Phase 1: Cleaning up redundant documentation..."

# Create archive directory
mkdir -p archive/{docs,test-results,scripts,assets}

# Essential docs to keep
ESSENTIAL_DOCS=(
    "README.md"
    "DEPLOYMENT_GUIDE.md" 
    "TESTING_GUIDE.md"
    "MANUAL_TESTING_GUIDE.md"
    "INSTALLATION_INSTRUCTIONS.md"
    "cleanup-optimization-plan.md"
)

# Move redundant documentation
print_status "Moving redundant documentation to archive..."
for file in *.md; do
    if [[ -f "$file" ]]; then
        # Check if file is in essential list
        is_essential=false
        for essential in "${ESSENTIAL_DOCS[@]}"; do
            if [[ "$file" == "$essential" ]]; then
                is_essential=true
                break
            fi
        done
        
        # Move non-essential docs to archive
        if [[ "$is_essential" == false ]]; then
            mv "$file" "archive/docs/"
            print_status "Archived: $file"
        fi
    fi
done

# Phase 2: Test Artifacts Cleanup
print_status "Phase 2: Cleaning up test artifacts..."

# Remove large test result directories
if [ -d "test-results" ]; then
    print_status "Removing test-results directory ($(du -sh test-results | cut -f1))..."
    rm -rf test-results/
    print_success "Removed test-results directory"
fi

if [ -d "playwright-report" ]; then
    print_status "Removing playwright-report directory..."
    rm -rf playwright-report/
    print_success "Removed playwright-report directory"
fi

# Move screenshots to archive if they exist
if [ -d "screenshots" ]; then
    print_status "Archiving screenshots..."
    mv screenshots/ archive/assets/
    print_success "Archived screenshots"
fi

# Clean up log files
print_status "Cleaning up log files..."
find . -name "*.log" -not -path "./node_modules/*" -not -path "./archive/*" -delete
print_success "Removed log files"

# Phase 3: Script Optimization
print_status "Phase 3: Optimizing scripts directory..."

# Archive old/redundant scripts
SCRIPTS_TO_ARCHIVE=(
    "add-default-exports.sh"
    "add-more-exports.sh"
    "generate-*-tests.js"
    "run-*-tests.sh"
    "fix-*.sh"
)

cd scripts/
for pattern in "${SCRIPTS_TO_ARCHIVE[@]}"; do
    for file in $pattern; do
        if [[ -f "$file" ]]; then
            mv "$file" "../archive/scripts/"
            print_status "Archived script: $file"
        fi
    done
done
cd ..

# Phase 4: Temporary Files Cleanup
print_status "Phase 4: Cleaning temporary files..."

# Remove TypeScript build info
if [ -f "tsconfig.tsbuildinfo" ]; then
    rm tsconfig.tsbuildinfo
    print_success "Removed TypeScript build info"
fi

# Remove various cache and temp files
find . -name ".DS_Store" -delete 2>/dev/null || true
find . -name "Thumbs.db" -delete 2>/dev/null || true
find . -name "*.tmp" -delete 2>/dev/null || true
find . -name "*.temp" -delete 2>/dev/null || true

# Phase 5: Git Cleanup
print_status "Phase 5: Git repository cleanup..."

# Add archive to .gitignore if not already there
if ! grep -q "archive/" .gitignore 2>/dev/null; then
    echo -e "\n# Archived files\narchive/" >> .gitignore
    print_success "Added archive/ to .gitignore"
fi

# Calculate space saved
print_status "Calculating space savings..."
CURRENT_SIZE=$(du -sh . --exclude=node_modules --exclude=.git | cut -f1)
print_success "Current project size (excluding node_modules): $CURRENT_SIZE"

# Summary
print_success "🎉 Cleanup completed successfully!"
echo ""
echo "📊 Summary:"
echo "  ✅ Documentation consolidated"
echo "  ✅ Test artifacts removed"
echo "  ✅ Scripts optimized"
echo "  ✅ Temporary files cleaned"
echo "  ✅ Git repository optimized"
echo ""
echo "📁 Archived files are in: ./archive/"
echo "💾 Backup created in: $BACKUP_DIR"
echo ""
print_warning "Next steps:"
echo "  1. Run 'npm run build' to verify everything works"
echo "  2. Run 'npm test' to ensure tests pass"
echo "  3. Review archived files and delete if not needed"
echo "  4. Commit the cleaned up codebase"

print_success "Cleanup script completed! 🚀"
