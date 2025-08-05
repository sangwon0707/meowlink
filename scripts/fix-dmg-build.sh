#!/bin/bash

echo "🐊 Fixing DMG build issues..."

# 1. 빌드 캐시 정리
echo "🧹 Cleaning build cache..."
rm -rf dist/
rm -rf node_modules/.cache/

# 2. electron-builder 캐시 정리
echo "🧹 Cleaning electron-builder cache..."
rm -rf ~/Library/Caches/electron-builder/

# 3. 네이티브 모듈 재빌드
echo "🔧 Rebuilding native modules..."
npm rebuild

# 4. DMG 빌드 (상세 로그 포함)
echo "🚀 Building DMG with verbose logging..."
DEBUG=electron-builder npm run build-mac

# 5. 결과 확인
if [ -f "dist/Elegator-1.0.0.dmg" ]; then
    echo "✅ DMG created successfully!"
    ls -la dist/
else
    echo "❌ DMG not found. Checking what was created:"
    ls -la dist/
fi
