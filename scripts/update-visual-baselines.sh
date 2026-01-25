#!/bin/bash

# Update Visual Regression Baselines
# This script updates the visual regression test baselines

echo "🎨 Updating Visual Regression Baselines..."
echo "=========================================="
echo ""

# Check if dev server is running
if ! lsof -ti:3001 > /dev/null 2>&1; then
  echo "⚠️  Dev server not running on port 3001"
  echo "Starting dev server..."
  npm run dev &
  DEV_PID=$!
  echo "Waiting for server to start..."
  sleep 10
fi

# Update snapshots
echo "📸 Updating visual snapshots..."
npx playwright test --update-snapshots

# Check if we started the dev server
if [ ! -z "$DEV_PID" ]; then
  echo "Stopping dev server..."
  kill $DEV_PID
fi

echo ""
echo "✅ Visual baselines updated successfully!"
echo "📁 Snapshots saved in: test-results/"
echo ""
echo "Next steps:"
echo "1. Review the updated snapshots"
echo "2. Commit the changes to version control"
echo "3. Re-run tests to verify: npm run test"

