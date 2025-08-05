# 📁 Folder Rename Guide: elegator-app → meowlink-app

## ✅ Good News!

**You can safely rename `elegator-app` to `meowlink-app` without breaking anything!**

## 🔍 Current Dependencies on Folder Name

### ❌ No Hard Dependencies Found:
- ✅ `package.json` already uses `"name": "meowlink"`
- ✅ App ID is `"com.meowlink.app"` (not tied to folder name)
- ✅ Product name is `"MeowLink"` (not tied to folder name)
- ✅ All source code uses relative imports (`./`, `../`, `@/`)
- ✅ No absolute paths referencing folder name in configs

### 🔧 Only References Found:
1. **Build artifacts in `node_modules/`** - These contain the full path but get regenerated after `npm install`
2. **One comment in `scripts/setup-database.js`** - Just a playful "Elegator" reference
3. **`PROJECT_STRUCTURE.md`** - Documentation file

## 📝 Safe Rename Process

### 1. Rename the folder:
```bash
mv elegator-app meowlink-app
```

### 2. Reinstall dependencies (to update build paths):
```bash
cd meowlink-app
rm -rf node_modules package-lock.json
npm install
```

### 3. Optional cleanup (update references):
- Update `PROJECT_STRUCTURE.md` if it exists
- Update any documentation that mentions "elegator-app"

## 🎯 Why It's Safe

- **Package.json** already correctly uses `"meowlink"` as the project name
- **All imports** use relative paths (`import ... from './components'`)
- **Build configuration** uses project name from package.json, not folder name
- **Database path** is determined by app name (`com.meowlink.app`), not folder name

## 🚀 After Rename

The application will work exactly the same:
- ✅ All features will function normally
- ✅ Database will remain in the same location
- ✅ Build scripts will work without modification
- ✅ Electron packaging will use the correct app name

---

**TL;DR: Renaming `elegator-app` → `meowlink-app` is completely safe! Just run `npm install` afterward to rebuild native modules.**