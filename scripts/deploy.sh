#!/bin/bash

# California Library Tracker - Deployment Script for Dreamhost Apps
# This script helps prepare the app for deployment

echo "📚 California Library Tracker - Deployment Script"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Error: Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

# Check if database exists, if not populate it
if [ ! -f "library.db" ]; then
    echo "🗄️  Database not found. Populating with California libraries..."
    node scripts/populate-libraries.js
    
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to populate database"
        exit 1
    fi
else
    echo "✅ Database already exists"
fi

# Create uploads directory if it doesn't exist
if [ ! -d "public/uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p public/uploads
fi

# Test the application
echo "🧪 Testing the application..."
node server.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Test if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running successfully"
else
    echo "❌ Error: Server failed to start"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Stop the test server
kill $SERVER_PID 2>/dev/null

echo ""
echo "🎉 Deployment preparation completed successfully!"
echo ""
echo "📋 Next steps for Dreamhost Apps deployment:"
echo "1. Commit your changes: git add . && git commit -m 'Ready for deployment'"
echo "2. Push to your repository: git push origin main"
echo "3. In Dreamhost panel:"
echo "   - Go to Domains → Dreamhost Apps"
echo "   - Create a new Node.js app"
echo "   - Connect your Git repository"
echo "   - Set start command to: node server.js"
echo "   - Deploy!"
echo ""
echo "🌐 Your app will be available at your configured domain"
echo ""
echo "📚 Happy Library Tracking! ✨" 