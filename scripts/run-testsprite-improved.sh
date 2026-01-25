#!/bin/bash

# Improved TestSprite Test Runner
# This script implements the recommendations from DETAILED_TEST_ANALYSIS.md
# to fix the 100% test failure rate

set -e

echo "🧪 TestSprite Improved Test Runner"
echo "===================================="
echo ""

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3006}"
USE_PRODUCTION="${USE_PRODUCTION:-false}"
PREWARM="${PREWARM:-true}"
SEQUENTIAL="${SEQUENTIAL:-false}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
  local color=$1
  local message=$2
  echo -e "${color}${message}${NC}"
}

# Function to check if server is running
check_server() {
  print_status "$YELLOW" "⏳ Checking if server is running..."
  
  for i in {1..30}; do
    if curl -s -f "$BASE_URL/api/health" > /dev/null 2>&1; then
      print_status "$GREEN" "✅ Server is running and healthy"
      return 0
    fi
    echo "   Waiting for server... (attempt $i/30)"
    sleep 2
  done
  
  print_status "$RED" "❌ Server is not responding"
  return 1
}

# Function to build production version
build_production() {
  print_status "$YELLOW" "🏗️  Building production version..."
  npm run build
  
  if [ $? -eq 0 ]; then
    print_status "$GREEN" "✅ Production build successful"
  else
    print_status "$RED" "❌ Production build failed"
    exit 1
  fi
}

# Function to start production server
start_production_server() {
  print_status "$YELLOW" "🚀 Starting production server..."
  
  # Kill any existing server on port 3006
  lsof -ti:3006 | xargs kill -9 2>/dev/null || true
  
  # Start production server in background
  PORT=3006 npm run start > /tmp/testsprite-server.log 2>&1 &
  SERVER_PID=$!
  
  echo "   Server PID: $SERVER_PID"
  sleep 5
  
  if check_server; then
    print_status "$GREEN" "✅ Production server started successfully"
    return 0
  else
    print_status "$RED" "❌ Failed to start production server"
    cat /tmp/testsprite-server.log
    exit 1
  fi
}

# Function to pre-warm server
prewarm_server() {
  if [ "$PREWARM" = "true" ]; then
    print_status "$YELLOW" "🔥 Pre-warming server routes..."
    ./scripts/prewarm-server.sh
  else
    print_status "$YELLOW" "⏭️  Skipping server pre-warming"
  fi
}

# Function to run tests
run_tests() {
  print_status "$YELLOW" "🧪 Running TestSprite tests..."
  
  if [ "$SEQUENTIAL" = "true" ]; then
    print_status "$YELLOW" "   Running tests sequentially..."
    run_tests_sequential
  else
    print_status "$YELLOW" "   Running tests in parallel..."
    run_tests_parallel
  fi
}

# Function to run tests sequentially
run_tests_sequential() {
  cd testsprite_tests
  
  local passed=0
  local failed=0
  local total=0
  
  for test_file in TC*.py; do
    total=$((total + 1))
    echo ""
    print_status "$YELLOW" "Running: $test_file"
    
    if python3 "$test_file"; then
      passed=$((passed + 1))
      print_status "$GREEN" "✅ PASSED: $test_file"
    else
      failed=$((failed + 1))
      print_status "$RED" "❌ FAILED: $test_file"
    fi
    
    # Cool-down period between tests
    sleep 2
  done
  
  cd ..
  
  echo ""
  echo "================================"
  print_status "$GREEN" "Test Results:"
  echo "   Total:  $total"
  echo "   Passed: $passed"
  echo "   Failed: $failed"
  echo "================================"
}

# Function to run tests in parallel
run_tests_parallel() {
  npm run testsprite
}

# Function to cleanup
cleanup() {
  if [ ! -z "$SERVER_PID" ]; then
    print_status "$YELLOW" "🧹 Cleaning up..."
    kill $SERVER_PID 2>/dev/null || true
    print_status "$GREEN" "✅ Cleanup complete"
  fi
}

# Trap to ensure cleanup on exit
trap cleanup EXIT

# Main execution
echo ""
print_status "$YELLOW" "Configuration:"
echo "   Base URL:        $BASE_URL"
echo "   Use Production:  $USE_PRODUCTION"
echo "   Pre-warm:        $PREWARM"
echo "   Sequential:      $SEQUENTIAL"
echo ""

# Step 1: Check or start server
if [ "$USE_PRODUCTION" = "true" ]; then
  build_production
  start_production_server
else
  if ! check_server; then
    print_status "$RED" "❌ Server is not running. Please start the development server first:"
    echo "   npm run dev:test"
    exit 1
  fi
fi

# Step 2: Pre-warm server
prewarm_server

# Step 3: Run tests
run_tests

# Step 4: Report results
echo ""
print_status "$GREEN" "✅ Test execution complete!"
echo ""
echo "📊 For detailed results, check:"
echo "   - testsprite_tests/testsprite-mcp-test-report.html"
echo "   - testsprite_tests/testsprite-mcp-test-report.md"
echo ""

