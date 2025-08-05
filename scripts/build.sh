#!/bin/bash

echo "🐊 Building Elegator for macOS..."

# 환경 확인
if [[ "$OSTYPE" != "darwin"* ]]; then
  echo "❌ macOS DMG can only be built on macOS"
  exit 1
fi

# Node.js 버전 확인
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# 의존성 설치
echo "📦 Installing dependencies..."
npm install

# 네이티브 모듈 리빌드
echo "🔧 Rebuilding native modules for Electron..."
npm run rebuild

# 빌드 디렉토리 정리
echo "🧹 Cleaning build directory..."
rm -rf dist/

# macOS DMG 빌드
echo "🚀 Building macOS DMG..."
npm run build-mac

# 빌드 결과 확인
if [ -d "dist" ]; then
  echo "✅ Build completed successfully!"
  echo "📁 Build files:"
  ls -la dist/
  
  # DMG 파일 찾기
  DMG_FILE=$(find dist -name "*.dmg" | head -1)
  if [ -n "$DMG_FILE" ]; then
    echo "🎉 DMG file created: $DMG_FILE"
    echo "📊 File size: $(du -h "$DMG_FILE" | cut -f1)"
  fi
else
  echo "❌ Build failed!"
  exit 1
fi

echo "🐊 Elegator build complete!"
