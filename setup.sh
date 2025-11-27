#!/bin/bash

# Exit on error
set -e

# Use local node if available
export PATH="$PWD/node-v20.10.0-darwin-x64/bin:$PATH"

echo "🚀 Setting up Surfari Ride Sharing System..."

echo "📦 Installing Backend Dependencies..."
cd backend
npm install
# Run seed if database doesn't exist
if [ ! -f "database.sqlite" ]; then
    echo "🌱 Seeding Database..."
    npm run seed
fi
cd ..

echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
cd ..

echo "✅ Setup Complete! Run './start.sh' to launch the application."
