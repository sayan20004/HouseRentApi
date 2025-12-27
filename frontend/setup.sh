#!/bin/bash

echo "🚀 Setting up House Rent Frontend..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Frontend setup complete!"
echo ""
echo "🎉 You can now run the following commands:"
echo "   npm run dev      - Start development server"
echo "   npm run build    - Build for production"
echo "   npm run preview  - Preview production build"
echo ""
echo "📝 Make sure your backend API is running on http://localhost:3000"
echo "🌐 Frontend will be available at http://localhost:5173"
echo ""
