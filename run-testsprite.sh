#!/bin/bash

###############################################################################
# COMPREHENSIVE TESTSPRITE TEST RUNNER
# Tests every page, component, and UI element - NO SHORTCUTS!
###############################################################################

echo "=========================================="
echo "🧪 MRF Educational Platform - Full Test Suite"
echo "=========================================="
echo ""
echo "📊 Test Coverage:"
echo "  - 45+ Pages (all routes)"
echo "  - 100+ Components (all UI elements)"
echo "  - All Buttons, Links, Navigation"
echo "  - Responsive Design (8 breakpoints)"
echo "  - Accessibility (WCAG 2.2 AA)"
echo "  - RTL/LTR Layouts"
echo "  - Dark/Light Themes"
echo "  - Cross-Browser Testing"
echo ""
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if server is running
echo "🔍 Checking if dev server is running..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${YELLOW}⚠️  Dev server not running. Starting it now...${NC}"
    npm run dev &
    SERVER_PID=$!
    echo "⏳ Waiting for server to start (30 seconds)..."
    sleep 30
    
    if ! curl -s http://localhost:3000 > /dev/null; then
        echo -e "${RED}❌ Failed to start dev server${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dev server started${NC}"
else
    echo -e "${GREEN}✅ Dev server is running${NC}"
fi

echo ""
echo "=========================================="
echo "🚀 Starting Comprehensive Test Suite"
echo "=========================================="
echo ""

# Create test results directory
mkdir -p test-results/testsprite
mkdir -p test-results/screenshots
mkdir -p test-results/videos

# Run TestSprite tests
echo "📝 Executing all tests..."
echo ""

# Set environment variables
export NODE_ENV=test
export TESTSPRITE_API_KEY=${TESTSPRITE_API_KEY}

# Run the tests based on scope
if [ "$1" == "quick" ]; then
    echo "⚡ Running quick smoke test (critical pages only)..."
    npx testsprite test --scope=critical --config=testsprite.config.js
elif [ "$1" == "pages" ]; then
    echo "📄 Running pages test only..."
    npx testsprite test --scope=pages --config=testsprite.config.js
elif [ "$1" == "components" ]; then
    echo "🧩 Running components test only..."
    npx testsprite test --scope=components --config=testsprite.config.js
elif [ "$1" == "ui" ]; then
    echo "🎨 Running UI elements test only..."
    npx testsprite test --scope=ui-elements --config=testsprite.config.js
elif [ "$1" == "a11y" ]; then
    echo "♿ Running accessibility test only..."
    npx testsprite test --scope=accessibility --config=testsprite.config.js
else
    echo "🌟 Running FULL COMPREHENSIVE test suite..."
    echo "   (This will take 30-60 minutes)"
    echo ""
    npx testsprite test --config=testsprite.config.js
fi

TEST_EXIT_CODE=$?

echo ""
echo "=========================================="
echo "📊 Test Results"
echo "=========================================="

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    echo "📁 Test artifacts saved to:"
    echo "   - HTML Report: test-results/testsprite/index.html"
    echo "   - JSON Report: test-results/testsprite/results.json"
    echo "   - Screenshots: test-results/screenshots/"
    echo "   - Videos: test-results/videos/"
else
    echo -e "${RED}❌ Some tests failed${NC}"
    echo ""
    echo "📁 Failure details saved to:"
    echo "   - HTML Report: test-results/testsprite/index.html"
    echo "   - Screenshots: test-results/screenshots/"
    echo "   - Videos: test-results/videos/"
fi

echo ""
echo "=========================================="
echo "💡 Quick Commands:"
echo "=========================================="
echo ""
echo "  ./run-testsprite.sh          # Run all tests"
echo "  ./run-testsprite.sh quick    # Run critical tests only"
echo "  ./run-testsprite.sh pages    # Test pages only"
echo "  ./run-testsprite.sh components # Test components only"
echo "  ./run-testsprite.sh ui       # Test UI elements only"
echo "  ./run-testsprite.sh a11y     # Test accessibility only"
echo ""

# Cleanup if we started the server
if [ ! -z "$SERVER_PID" ]; then
    echo "🛑 Stopping dev server..."
    kill $SERVER_PID
fi

exit $TEST_EXIT_CODE

