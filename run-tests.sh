#!/bin/bash

# Claims API Test Runner Script
# This script ensures Playwright browsers are installed and runs the tests

set -e  # Exit on error

echo "🔧 Claims API Test Setup & Execution"
echo "===================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci
else
    echo "✅ Dependencies already installed"
fi

# Install Playwright browsers (safe to run multiple times)
echo "🌐 Ensuring Playwright browsers are installed..."
npx playwright install chromium --with-deps

echo ""
echo "🚀 Starting tests..."
echo "===================="
npm test

echo ""
echo "✅ Tests completed!"
echo "📊 View the HTML report with: npx playwright show-report"

