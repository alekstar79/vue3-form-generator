# 1. Hash Mode in router.ts (createWebHashHistory)
# 2. vite.github.config.ts (only base + plugins + outDir)
# 3. Rebuild
rm -rf gh-pages/ node_modules/.vite/
yarn build:github

# 4. Check
ls -la gh-pages/
cat gh-pages/index.html | grep script

# 5. Copy
rm -rf /media/alekstar79/Cargo/Home/github.io/public/vue3-form-generator/*
cp -r gh-pages/* /media/alekstar79/Cargo/Home/github.io/public/vue3-form-generator/

rm -rf /media/alekstar79/Cargo/Home/alekstar79.github.io/vue3-form-generator/*
cp -r gh-pages/* /media/alekstar79/Cargo/Home/alekstar79.github.io/vue3-form-generator/

# 6. Deploy
cd /media/alekstar79/Cargo/Home/alekstar79.github.io
git add vue3-form-generator/
git commit -m "Switch to Hash Mode - fix deployment"
git push origin master
