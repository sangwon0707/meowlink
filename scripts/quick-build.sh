#!/bin/bash

echo "🐊 Quick DMG Build for Elegator"

# 의존성 확인
if ! command -v electron-builder &> /dev/null; then
    echo "Installing electron-builder..."
    npm install
fi

# 빌드 실행
echo "Building macOS DMG..."
npm run build-mac

echo "✅ Build complete! Check the 'dist' folder."
