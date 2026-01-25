#!/bin/bash

# Full Website Audit Script
# This script runs a comprehensive test suite on the entire MRF Educational Platform

set -e

echo "🚀 Starting Full Website Audit..."
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if dev server is running
echo "📡 Checking if dev server is running..."
if ! lsof -ti:3001 > /dev/null; then
    echo -e "${YELLOW}⚠️  Dev server not running on port 3001${NC}"
    echo "Starting dev server..."
    npm run dev &
    DEV_SERVER_PID=$!
    echo "Waiting for server to start..."
    sleep 15
else
    echo -e "${GREEN}✓ Dev server is running${NC}"
fi

echo ""
echo "🧪 Running Comprehensive Test Suite..."
echo "======================================="
echo ""

# Run the full audit
echo "1️⃣  Running Full Website Audit..."
npx playwright test tests/comprehensive/full-website-audit.spec.ts \
    --reporter=html \
    --reporter=list \
    --reporter=json \
    --output=test-results/full-audit

echo ""
echo "2️⃣  Running Existing Comprehensive Tests..."
npx playwright test tests/comprehensive/all-pages.spec.ts \
    --reporter=list

echo ""
echo "3️⃣  Running Accessibility Tests..."
npx playwright test tests/accessibility.spec.ts \
    --reporter=list

echo ""
echo "📊 Generating Test Report..."
echo "============================="
echo ""

# Generate summary
echo -e "${GREEN}✅ Full Website Audit Complete!${NC}"
echo ""
echo "📁 Test Results:"
echo "   - HTML Report: playwright-report/index.html"
echo "   - JSON Report: test-results/full-audit/"
echo ""
echo "🌐 Open HTML Report:"
echo "   npx playwright show-report"
echo ""

# Kill dev server if we started it
if [ ! -z "$DEV_SERVER_PID" ]; then
    echo "Stopping dev server..."
    kill $DEV_SERVER_PID 2>/dev/null || true
fi

echo -e "${GREEN}✨ Audit Complete!${NC}"

