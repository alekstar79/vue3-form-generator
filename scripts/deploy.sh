#!/bin/bash
# deploy.sh

echo "🏗️ Build..."
rm -rf gh-pages/
yarn build:github

echo "🔧 Fix permissions..."
sudo chown -R $(whoami):$(whoami) gh-pages/ 2>/dev/null || true

echo "✅ Check permissions..."
ls -la gh-pages/assets/_plugin-vue* | head -1

echo "📤 Deploy..."
rm -rf /media/alekstar79/Cargo/Home/alekstar79.github.io/vue3-form-generator/*
cp -r gh-pages/* /media/alekstar79/Cargo/Home/alekstar79.github.io/vue3-form-generator/

cd ~/alekstar79.github.io
git add vue3-form-generator/ -f
git commit -m "Force deploy vue3-form-generator $(date)"
git push origin master

echo "✅ Deploy complete! Check in 5-10 min:"
echo "https://alekstar79.github.io/vue3-form-generator/"
