# 🔢 Version Management Guide

**Centralized version configuration for MeowLink**

---

## 📋 **Overview**

MeowLink uses a **centralized version management system** to avoid hardcoding version numbers throughout the codebase. This ensures easy maintenance and consistency across all components.

## 🏗 **Architecture**

### **Single Source of Truth**
- **`package.json`** contains the authoritative version number
- All other components read from this single source
- No hardcoded versions in UI components or documentation

### **Version Flow**
```
package.json → preload.js → electronAPI → React components
                          → utils/version.ts → UI display
```

---

## 📁 **Files Involved**

### **1. `package.json`** - Source of Truth
```json
{
  "version": "0.1.0"
}
```

### **2. `preload.js`** - Electron Bridge
```javascript
const packageJson = require("./package.json")

contextBridge.exposeInMainWorld("electronAPI", {
  getVersion: () => packageJson.version,
  version: packageJson.version,
  // ... other APIs
})
```

### **3. `src/utils/version.ts`** - Utility Functions
```typescript
export function getAppVersion(): string {
  return window.electronAPI?.getVersion() || '0.1.0'
}

export function getDisplayVersion(): string {
  return `v${getAppVersion()}`
}
```

### **4. `src/components/Sidebar.tsx`** - UI Implementation
```typescript
import { getDisplayVersion } from '../utils/version'

// In component:
<p className="text-sm text-sidebar-muted-foreground font-medium">
  {getDisplayVersion()}
</p>
```

---

## 🔄 **How to Update Version**

### **1. Update Package.json (Only Place)**
```bash
# Edit package.json
"version": "0.2.0"  # Change this line only
```

### **2. Version Changes Automatically Propagate**
- ✅ Sidebar displays new version
- ✅ electronAPI returns new version
- ✅ All documentation stays consistent

### **3. Build Process**
```bash
npm run build-react  # Bundles new version
npm run build-mac    # Creates DMG with new version
```

---

## 🎯 **Benefits**

### **Maintainability**
- **Single update point** - Only change `package.json`
- **No grep/replace** needed across multiple files
- **Automatic consistency** across all components

### **Development Experience**
- **Type safety** with TypeScript utilities
- **Runtime access** to version information
- **Build process integration** 

### **User Experience**
- **Consistent branding** - Same version everywhere
- **Proper display formatting** - "v0.1.0" format
- **No version mismatches** between UI and app

---

## 🛠 **Utility Functions**

### **`getAppVersion()`**
Returns the raw version string from package.json
```typescript
getAppVersion() // → "0.1.0"
```

### **`getDisplayVersion()`**
Returns formatted version for UI display
```typescript
getDisplayVersion() // → "v0.1.0"
```

### **`parseVersion(version)`**
Parses version into components
```typescript
parseVersion("0.1.0") // → { major: 0, minor: 1, patch: 0 }
```

### **`compareVersions(a, b)`**
Compares two version strings
```typescript
compareVersions("0.1.0", "0.2.0") // → -1 (a < b)
```

---

## 🔧 **Integration Points**

### **Electron Main Process**
- `package.json` is directly accessible
- Version available for app metadata
- Build process uses version for naming

### **Renderer Process**
- Version accessed via `electronAPI.getVersion()`
- Utilities handle fallbacks gracefully
- TypeScript ensures type safety

### **Build System**
- Webpack bundles version utilities
- Electron Builder uses package.json version
- Distribution files include correct version

---

## 🚨 **Important Notes**

### **❌ Do NOT hardcode versions in:**
- React components
- CSS files
- Documentation
- Configuration files
- Build scripts

### **✅ DO update version in:**
- `package.json` only
- Let the system propagate changes automatically

### **🔍 Verification**
After version update, check:
- Sidebar shows new version
- Built app has correct version in About dialog
- DMG/installer has correct version number

---

## 📊 **Version History**

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | Aug 2025 | Initial release with centralized version system |

---

**This system ensures version consistency and makes maintenance simple - just update `package.json` and everything else follows automatically! 🎯**