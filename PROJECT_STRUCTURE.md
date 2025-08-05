# 📁 MeowLink Project Structure

**Detailed overview of the project architecture and file organization**

---

## 🏗 **Architecture Overview**

MeowLink follows a **modern React + Electron architecture** with clear separation between frontend (React/TypeScript) and backend (Node.js/SQLite) concerns.

```
Frontend (React/TS) ←→ IPC Bridge (Preload) ←→ Backend (Node.js/SQLite)
```

### **Process Architecture**
- **Main Process** (`main.js`) - Electron application lifecycle, window management, database operations
- **Renderer Process** (`src/`) - React UI running in Chromium webview
- **Preload Script** (`preload.js`) - Secure IPC communication bridge
- **Database Layer** (`utils/`) - SQLite operations and web scraping utilities

---

## 📂 **Root Directory Structure**

```
meowlink/
├── 📄 main.js                    # Electron main process entry point
├── 📄 preload.js                 # Secure IPC bridge
├── 📄 package.json               # Dependencies and npm scripts
├── 📄 webpack.config.js          # Build configuration
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 postcss.config.js          # PostCSS configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 .gitignore                 # Git ignore rules
├── 📄 README.md                  # Project documentation
├── 📄 PROJECT_STRUCTURE.md       # This file
├── 📄 ROADMAP.md                 # Feature roadmap
├── 📄 FOLDER_RENAME_GUIDE.md     # Folder renaming instructions
├── 📄 CLAUDE.md                  # AI assistant instructions
│
├── 📁 src/                       # React TypeScript frontend
├── 📁 utils/                     # Node.js backend utilities
├── 📁 assets/                    # Application icons and images
├── 📁 scripts/                   # Build automation scripts
├── 📁 renderer/                  # Legacy HTML files (being phased out)
├── 📁 build/                     # Webpack build output
├── 📁 dist/                      # Electron builder distribution
└── 📁 node_modules/              # NPM dependencies
```

---

## ⚛️ **Frontend Structure (`src/`)**

**React 18 + TypeScript + Tailwind CSS + shadcn/ui**

```
src/
├── 📄 index.tsx                  # Application entry point
├── 📄 App.tsx                    # Main React component
│
├── 📁 components/                # React components
│   ├── 📁 ui/                   # shadcn/ui components
│   │   ├── 📄 alert-dialog.tsx  # Confirmation dialogs
│   │   ├── 📄 avatar.tsx        # User/site avatars
│   │   ├── 📄 badge.tsx         # Tags and labels
│   │   ├── 📄 button.tsx        # Interactive buttons
│   │   ├── 📄 card.tsx          # Content containers
│   │   ├── 📄 dialog.tsx        # Modal dialogs
│   │   ├── 📄 dropdown-menu.tsx # Context menus (unused)
│   │   ├── 📄 input.tsx         # Form inputs
│   │   ├── 📄 label.tsx         # Form labels
│   │   ├── 📄 textarea.tsx      # Multi-line inputs
│   │   └── 📄 tooltip.tsx       # Hover tooltips
│   │
│   ├── 📄 Sidebar.tsx           # Navigation sidebar with filters
│   ├── 📄 LinkCard.tsx          # Individual bookmark cards
│   └── 📄 AddLinkModal.tsx      # Add/edit bookmark dialog
│
├── 📁 contexts/                 # React Context providers
│   └── 📄 AppContext.tsx        # Global state management
│
├── 📁 types/                    # TypeScript definitions
│   └── 📄 index.ts              # Application type definitions
│
├── 📁 utils/                    # Frontend utilities
│   └── 📄 urlUtils.ts           # URL validation and formatting
│
└── 📁 styles/                   # CSS and styling
    └── 📄 global-clean.css      # Tailwind CSS with custom variables
```

### **Key Frontend Files**

#### **`src/index.tsx`** - Application Bootstrap
- React 18 createRoot
- Context provider wrapping
- Global CSS imports

#### **`src/App.tsx`** - Main Application Component
- Layout management (sidebar + content)
- State management integration
- Loading/error states
- Modal management

#### **`src/components/Sidebar.tsx`** - Navigation
- Filter buttons (All Bookmarks, Favorites)
- Dark mode toggle with orange theme
- Popular tags section
- Consistent orange selection states

#### **`src/components/LinkCard.tsx`** - Bookmark Display
- Consistent 208px height (`h-52`)
- 15-character title truncation
- **Inline memo editing** - Click memo area to edit directly
- Direct action buttons (star, edit, delete, open)
- Favicon display with fallbacks

#### **`src/components/AddLinkModal.tsx`** - Link Management
- Add/edit bookmark form
- URL validation and correction
- Tag management
- Orange themed buttons

#### **`src/contexts/AppContext.tsx`** - State Management
- React Context + useReducer
- Link CRUD operations
- Search/filter state
- Dark mode state

---

## 🔧 **Backend Structure (`utils/` & root)**

**Node.js + SQLite + Web Scraping**

```
utils/
├── 📄 database-sqlite3.js        # SQLite operations (production)
├── 📄 database-electron.ts       # TypeScript SQLite wrapper
├── 📄 database.ts                # Legacy database interface
└── 📄 scraper.js                 # Web metadata extraction

Root Backend Files:
├── 📄 main.js                    # Electron main process
└── 📄 preload.js                 # IPC security bridge
```

### **Key Backend Files**

#### **`main.js`** - Electron Main Process
- Application lifecycle management
- Window creation and management
- IPC handlers for database operations
- Menu and system integration
- Database initialization

#### **`preload.js`** - Security Bridge
- Secure IPC API exposure
- Context isolation enforcement
- Database operation wrappers

#### **`utils/database-sqlite3.js`** - Database Operations
- SQLite3 connection management
- CRUD operations for links
- Notification system
- Error handling and logging

#### **`utils/scraper.js`** - Web Metadata
- URL metadata extraction
- Favicon fetching with fallbacks
- Title and description scraping
- Error handling for failed requests

---

## 🗄 **Database Schema**

**SQLite table structure in `utils/database-sqlite3.js`**

```sql
links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  favicon TEXT,
  memo TEXT,
  tags TEXT,                    -- JSON array stored as string
  created_at TEXT NOT NULL,
  is_favorite INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

### **Removed Fields** (Simplified from reminder app)
- `reminder_date` - Removed to focus on pure bookmarking
- `is_completed` - Removed task-like functionality

---

## 🎨 **Styling Architecture**

**Tailwind CSS v3 + shadcn/ui + Custom Orange Theme**

### **`src/styles/global-clean.css`**
```css
@tailwind base;
@tailwind components; 
@tailwind utilities;

:root {
  /* Standard shadcn/ui CSS variables */
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  /* ... */
  
  /* Custom brand orange theme (#ff8f00) */
  --brand-orange: 34 100% 50%;              /* #ff8f00 */
  --brand-orange-foreground: 0 0% 100%;     /* White */
  --brand-orange-dark: 34 100% 40%;         /* Hover state */
  --brand-orange-light: 34 100% 60%;        /* Light variant */
  /* ... */
}

.dark {
  /* Dark mode overrides */
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* Orange theme remains consistent in dark mode */
  --brand-orange: 34 100% 50%;              /* Same vivid orange */
}
```

### **`tailwind.config.js`**
- shadcn/ui color integration
- Custom brand-orange color definitions
- Typography and spacing configuration
- Animation definitions

---

## 🔨 **Build System**

**Webpack 5 + PostCSS + Electron Builder**

### **`webpack.config.js`**
- TypeScript compilation
- CSS processing with PostCSS
- React Fast Refresh (development)
- Production optimizations

### **`postcss.config.js`**
- Tailwind CSS processing
- Autoprefixer for browser compatibility

### **Package.json Scripts**
```json
{
  "start": "electron .",
  "dev": "npm run build-react && electron . --dev",
  "build-react": "webpack --mode=production",
  "build-mac": "npm run build-react && electron-builder --mac",
  "build-win": "npm run build-react && electron-builder --win",
  "build-linux": "npm run build-react && electron-builder --linux",
  "clean": "rm -rf node_modules package-lock.json dist build",
  "rebuild": "npm rebuild --runtime=electron --target=13.6.9"
}
```

---

## 🔐 **Security Architecture**

### **Context Isolation**
- `contextIsolation: true` in webPreferences
- `nodeIntegration: false` for security
- Preload script with controlled API exposure

### **IPC Communication**
```javascript
// preload.js - Secure API
window.electronAPI = {
  saveLink: (linkData) => ipcRenderer.invoke("db-save-link", linkData),
  updateLink: (id, updates) => ipcRenderer.invoke("db-update-link", id, updates),
  deleteLink: (id) => ipcRenderer.invoke("db-delete-link", id),
  getAllLinks: () => ipcRenderer.invoke("db-get-all-links"),
  openExternal: (url) => ipcRenderer.invoke("open-external", url)
}

// main.js - IPC Handlers
ipcMain.handle("db-save-link", async (event, linkData) => {
  return await dbManager.saveLink(linkData)
})
ipcMain.handle("db-delete-link", async (event, id) => {
  return await dbManager.deleteLink(id)
})
```

---

## 📦 **Distribution Structure**

### **Development Build** (`build/`)
```
build/
├── 📄 index.html              # HTML template
├── 📄 bundle.js               # Webpack compiled JS
├── 📄 bundle.js.map           # Source maps
└── 📄 bundle.css              # Compiled CSS
```

### **Production Distribution** (`dist/`)
```
dist/
├── 📁 mac/                    # macOS DMG
├── 📁 win-unpacked/           # Windows installer
├── 📁 linux-unpacked/         # Linux AppImage
└── 📄 builder-effective-config.yaml
```

---

## 🔄 **Data Flow**

### **Add Bookmark Flow**
1. User clicks "Add Link" button in UI
2. `AddLinkModal` component opens
3. User submits form → `handleSaveLink()` in `App.tsx`
4. URL correction via `urlUtils.correctUrl()`
5. IPC call via `window.electronAPI.saveLink()`
6. Main process receives via `ipcMain.handle("db-save-link")`
7. Database insert via `dbManager.saveLink()`
8. Web scraping via `scraper.js` for metadata
9. UI state update via Context dispatch
10. Modal closes and card appears

### **Inline Memo Edit Flow**
1. User clicks memo area on `LinkCard`
2. Edit mode activates with textarea
3. User types and clicks orange "Save" button
4. IPC call to update only memo field
5. Database update via `updateLink()`
6. Context state update
7. Card displays new memo without modal

### **Delete Link Flow**
1. User clicks trash icon on `LinkCard`
2. AlertDialog confirmation appears
3. User confirms deletion
4. IPC call via `window.electronAPI.deleteLink()`
5. Database DELETE operation
6. Context state removes link
7. Card disappears from UI

---

## 🎨 **Design System Features**

### **Orange Theme Implementation**
- **Primary Color**: #ff8f00 (HSL: 34 100% 50%)
- **Usage**: Navigation selection, buttons, focus states
- **Dark Mode**: Consistent orange across light/dark themes
- **Accessibility**: WCAG AA compliant contrast ratios

### **Consistent Layout System**
- **Card Heights**: Fixed 208px (`h-52`) for uniform grid
- **Title Length**: 15-character limit with ellipsis
- **Action Buttons**: Direct buttons (no dropdowns)
- **Spacing**: Consistent padding and margins

### **Component Features**
- **Hover Effects**: Subtle elevation and color transitions
- **Loading States**: Animated spinners and skeletons
- **Empty States**: Friendly messages with action prompts
- **Error Handling**: User-friendly error messages

---

## 🧪 **Development Workflow**

### **Local Development**
1. `npm install` - Install dependencies
2. `npm run build-react` - Build frontend
3. `npm run dev` - Start with DevTools
4. Make changes to React components
5. Rebuild frontend and restart

### **Production Build**
1. `npm run build-react` - Optimize frontend
2. `npm run build-mac` - Create DMG (macOS)
3. Test installation package
4. Upload to distribution

---

## 📋 **Migration Notes**

### **From Vanilla JS to React**
- ✅ Migrated from `renderer/app.js` to `src/App.tsx`
- ✅ Replaced DOM manipulation with React state
- ✅ Added TypeScript for type safety
- ✅ Integrated modern CSS with Tailwind

### **From Elegator to MeowLink**
- ✅ Rebranded UI elements and copy
- ✅ Updated package.json and configurations
- ✅ Changed color scheme to orange (#ff8f00)
- ✅ Simplified from reminder app to pure bookmarking

### **UI/UX Improvements**
- ✅ Added inline memo editing
- ✅ Implemented consistent card layout
- ✅ Replaced dropdowns with direct buttons
- ✅ Fixed dark mode toggle colors
- ✅ Added confirmation dialogs for destructive actions

### **Legacy Files** (Can be removed)
- `renderer/index.html` - Replaced by React build
- `renderer/app.js` - Replaced by `src/App.tsx`
- `renderer/test.html` - Development file

---

## 🚀 **Key Commands**

```bash
# Development
npm run dev              # Development mode with DevTools
npm run build-react      # Build React app only
npm start               # Start production app

# Building
npm run build           # Build for all platforms
npm run build-mac       # macOS DMG build
npm run build-win       # Windows installer build
npm run build-linux     # Linux AppImage build

# Maintenance
npm run clean           # Clean build files and cache
npm run rebuild         # Rebuild native modules

# Quick Scripts
./scripts/quick-build.sh # Fast DMG build for development
./scripts/build.sh       # Complete build with dependencies
```

---

## 📊 **Project Statistics**

### **Codebase Metrics**
- **Frontend**: ~20 React components
- **Backend**: 4 utility modules
- **Languages**: TypeScript (70%), JavaScript (25%), CSS (5%)
- **Dependencies**: 25+ production, 15+ development

### **Features Completed**
- ✅ React + TypeScript migration
- ✅ Tailwind CSS + shadcn/ui integration
- ✅ Orange theme implementation
- ✅ Consistent card layout system
- ✅ Inline memo editing
- ✅ Direct action buttons
- ✅ Dark mode with orange theme
- ✅ URL correction algorithm
- ✅ Delete confirmations
- ✅ Search and filtering

---

This structure provides a **scalable, maintainable foundation** for continued development while maintaining clear separation of concerns and modern development practices. The architecture supports both current features and planned future enhancements like browser extensions and cloud sync.