#!/bin/bash

echo "🐊 Testing DMG build..."

# 최소한의 설정으로 DMG 빌드 테스트
npx electron-builder --mac --config.mac.target=dmg --config.directories.output=dist-test

if [ -f "dist-test/*.dmg" ]; then
    echo "✅ DMG test successful!"
    ls -la dist-test/
else
    echo "❌ DMG test failed"
    echo "Available files:"
    ls -la dist-test/ 2>/dev/null || echo "No dist-test directory"
fi
