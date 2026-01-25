#!/bin/bash

# Pre-warm Server Script
# This script visits all critical routes to trigger Turbopack compilation
# before running automated tests, reducing test failures due to lazy compilation

echo "🔥 Pre-warming server routes..."
echo "================================"

BASE_URL="${BASE_URL:-http://localhost:3006}"
TIMEOUT=10

# Function to check if server is ready
check_health() {
  echo "⏳ Checking server health..."
  for i in {1..30}; do
    if curl -s -f "$BASE_URL/api/health" > /dev/null 2>&1; then
      echo "✅ Server is healthy and ready"
      return 0
    fi
    echo "   Waiting for server... (attempt $i/30)"
    sleep 2
  done
  echo "❌ Server health check failed"
  return 1
}

# Function to warm up a route
warm_route() {
  local route=$1
  local name=$2
  echo "🔥 Warming: $name ($route)"
  
  response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$BASE_URL$route" 2>/dev/null)
  
  if [ "$response" = "200" ] || [ "$response" = "304" ]; then
    echo "   ✅ $name loaded successfully (HTTP $response)"
  else
    echo "   ⚠️  $name returned HTTP $response"
  fi
}

# Check if server is running
if ! check_health; then
  echo "❌ Server is not running. Please start the server first."
  exit 1
fi

echo ""
echo "🔥 Warming critical routes..."
echo "================================"

# Critical routes to pre-warm
warm_route "/ar" "Homepage"
warm_route "/ar/login" "Login Page"
warm_route "/ar/signup" "Signup Page"
warm_route "/ar/dashboard" "Dashboard"
warm_route "/ar/courses" "Courses"
warm_route "/ar/lessons" "Lessons"
warm_route "/ar/quizzes" "Quizzes"
warm_route "/ar/shop" "Shop"
warm_route "/ar/profile" "Profile"
warm_route "/ar/achievements" "Achievements"
warm_route "/ar/leaderboard" "Leaderboard"

echo ""
echo "================================"
echo "✅ Server pre-warming complete!"
echo "================================"
echo ""
echo "The server is now ready for automated testing."
echo "All critical routes have been compiled and cached."

