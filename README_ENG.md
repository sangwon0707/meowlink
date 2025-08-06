# 🐱 MeowLink

![MeowLink](screenshots/MeowLink_splash.png)

**Modern Bookmark Management App for Developers**

*Organize, save, and revisit your valuable links with beautiful design*

[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

---

## 🎯 **What is MeowLink?**

MeowLink is a **modern desktop bookmark management application** built with React, TypeScript, and Electron. Designed specifically for developers who need a clean, efficient way to organize and access their important web resources.

> **"Your purr-fect bookmark companion 🐱"**

## 📸 **Screenshots**

### 🌅 **Light Mode**
<div align="center">

**Main Interface**
![MeowLink Main Screen - Light](screenshots/MeowLink_main_light.png)

**Add Link Modal**
![Add Link Modal - Light](screenshots/LinkModal_light.png)

</div>

### 🌙 **Dark Mode**
<div align="center">

**Main Interface**
![MeowLink Main Screen - Dark](screenshots/MeowLink_main_dark.png)

**Add Link Modal**
![Add Link Modal - Dark](screenshots/LinkModal_dark.png)

</div>

## ✨ **Features**

### 🔗 **Smart Link Management**
- **One-click saving** - Add links with automatic metadata extraction
- **Inline memo editing** - Edit notes directly on cards without opening modals
- **Smart URL correction** - Automatically adds https:// for convenience
- **Favicon fetching** - Beautiful visual indicators for each site
- **Title optimization** - Clean, 15-character title display for consistency
- **Fixed card dimensions** - Consistent 415px width for uniform grid layout
- **Auto-uppercase tags** - Hashtags automatically converted to uppercase for consistency
- **Welcome guide** - First-launch dialog explains database location and backup

### 🎨 **Beautiful Modern UI**
- **Tailwind CSS + shadcn/ui** - Professional, consistent design system
- **Orange accent theme** (#ff8f00) - Distinctive brand colors throughout
- **Dark/Light modes** - Perfect for any lighting condition
- **Fixed card dimensions** - Precise 415px × 208px cards for perfect grid alignment
- **Multilingual text handling** - Smart truncation for English and Korean content
- **Glass-morphism removed** - Clean, accessible design

### 🚀 **Developer Experience**
- **React 18 + TypeScript** - Modern development stack
- **Context API state management** - Predictable state updates
- **IPC security** - Secure communication between processes
- **SQLite local storage** - Fast, private, reliable data storage
- **Real-time search** - Instant filtering across all bookmarks
- **Keyboard shortcuts** - Work at the speed of thought
- **Centralized version management** - Single source of truth for app version

### 🎯 **Core Functionality**
- **Bookmark management** - Add, edit, delete, and organize links
- **Favorites system** - Star important bookmarks for quick access
- **Intelligent tag system** - Auto-uppercase hashtags with smart filtering
- **Search functionality** - Find bookmarks by title, URL, memo, or tags
- **Direct link actions** - Star, edit, delete, and open with dedicated buttons
- **Consistent layout** - Fixed-size cards prevent layout shifts and maintain visual harmony
- **Database transparency** - Always know where your data is stored and how to back it up

## 🛠 **Technology Stack**

### **Frontend**
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v3** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Lucide React** - Beautiful, consistent icons

### **Backend**
- **Electron 13** - Cross-platform desktop framework
- **Node.js** - JavaScript runtime
- **SQLite3** - Lightweight database
- **better-sqlite3** - High-performance SQLite binding

### **Build Tools**
- **Webpack 5** - Module bundler
- **PostCSS** - CSS processing
- **Electron Builder** - Application packaging
- **TypeScript Compiler** - Type checking and compilation

## 🚀 **Installation & Development**

### **Prerequisites**
- Node.js 16+
- npm or yarn
- Git

### **Development Setup**
```bash
# Clone the repository
git clone https://github.com/sangwon0707/meowlink.git
cd meowlink

# Install dependencies
npm install

# Build React components
npm run build-react

# Run in development mode
npm run dev

# Start the app normally
npm start
```

### **Build Commands**

#### **🚀 Production Builds (For Distribution)**
```bash
# Platform-specific builds for end users
npm run build-mac     # → dist/MeowLink-0.1.0.dmg (macOS installer)
npm run build-win     # → dist/MeowLink Setup 0.1.0.exe (Windows installer)
npm run build-linux  # → dist/MeowLink-0.1.0.AppImage (Linux executable)

# Build for all platforms (if environment supports it)
npm run build

# Quick development build (macOS)
./scripts/quick-build.sh
```

#### **⚙️ Development Builds**
```bash
# Build React frontend only
npm run build-react

# Package without installer (for testing)
npm run pack
```

#### **📦 Distribution Files**
After building, find your distributable files in `dist/`:
- **DMG files** - macOS users drag to Applications folder
- **EXE files** - Windows users run installer
- **AppImage files** - Linux users make executable and run
- **No Node.js required** - End users just click and run!

### **Maintenance**
```bash
# Clean build files
npm run clean

# Rebuild native modules
npm run rebuild
```

## 📁 **Project Structure**

```
meowlink-app/
├── main.js                 # Electron main process
├── preload.js             # Secure IPC bridge
├── package.json           # Dependencies and scripts
├── webpack.config.js      # Build configuration
├── tailwind.config.js     # Tailwind CSS setup
├── postcss.config.js      # PostCSS configuration
│
├── src/                   # React TypeScript source
│   ├── index.tsx         # Application entry point
│   ├── App.tsx           # Main React component
│   ├── contexts/         # React Context providers
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── Sidebar.tsx  # Navigation sidebar with GitHub link
│   │   ├── LinkCard.tsx # Fixed-size bookmark cards (415px)
│   │   └── AddLinkModal.tsx # Add/edit link dialog with auto-uppercase tags
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Utility functions
│   │   └── textUtils.ts # Multilingual text processing utilities
│   └── styles/          # CSS and styling
│
├── utils/                # Node.js utilities
│   ├── database-sqlite3.js  # SQLite operations
│   ├── database-electron.ts # TypeScript database
│   └── scraper.js          # Web metadata extraction
│
├── build/                # Webpack build output
├── dist/                 # Electron builder output
├── assets/              # Application icons
└── scripts/             # Build automation scripts
```

## 🎮 **Usage**

### **First Launch Experience**
🎊 **Welcome Dialog** - On first launch, MeowLink shows a friendly welcome dialog that:
- Explains where your bookmark data is stored locally
- Shows the exact database file path on your system
- Provides "Show in Finder" and "Copy Path" buttons
- Explains backup and privacy benefits of local storage

### **Basic Operations**
1. **Add Link** - Click the orange "Add Link" button or use keyboard shortcut
2. **Edit Memo** - Click directly on any card's memo area to edit notes inline
3. **Manage Links** - Use the action buttons (star, edit, delete, open) on each card
4. **Search** - Type in the search bar to filter bookmarks instantly
5. **Filter** - Click "All Bookmarks" or "Favorites" in the sidebar
6. **Database Location** - Access via menu: MeowLink → Show Database Location

### **Keyboard Shortcuts**
| Shortcut | Action |
|----------|--------|
| `⌘+N` / `Ctrl+N` | Add new bookmark |
| `⌘+F` / `Ctrl+F` | Focus search |
| `Escape` | Close modals/cancel editing |

### **Features in Detail**

#### **Inline Memo Editing**
- Click any memo area to edit notes directly
- No need to open the full edit modal for quick note changes
- Orange "Save" button matches the app theme
- "Cancel" button to discard changes

#### **Smart URL Handling**
- Automatically adds `https://` to URLs without protocol
- Prevents infinite slash addition bugs
- Validates URLs before saving

#### **Consistent Card Layout**
- All cards maintain uniform dimensions (415px × 208px)
- Titles truncated to 15 characters for consistency
- Content areas don't shift when hovering or editing
- Perfect grid alignment with fixed sizing

#### **Smart Tag Management**
- Hashtags automatically converted to uppercase when entered
- Existing tags also displayed in uppercase for consistency
- Visual tag preview while typing
- Easy tag removal with click-to-delete interface

### **📁 Data Management & Backup**

#### **Database Location**
Your bookmarks are stored locally in a SQLite database:
- **macOS**: `~/Library/Application Support/MeowLink/meowlink.db`
- **Windows**: `%APPDATA%/MeowLink/meowlink.db` 
- **Linux**: `~/.config/MeowLink/meowlink.db`

#### **Easy Backup**
1. **Menu Access**: MeowLink → Show Database Location
2. **Copy File**: Simply copy the `meowlink.db` file to your backup location
3. **Restore**: Replace the database file to restore all bookmarks

#### **Privacy Benefits**
- ✅ **Local storage only** - No cloud sync or external servers
- ✅ **Complete privacy** - Your data never leaves your computer
- ✅ **Full control** - You own and manage your bookmark data
- ✅ **Fast performance** - No network latency or sync delays

## 🎨 **Design System**

### **Colors**
- **Primary Orange**: #ff8f00 (HSL: 34 100% 50%)
- **Orange Foreground**: White text on orange backgrounds
- **Orange Hover**: #cc7300 (HSL: 34 100% 40%)

### **Components**
- **Cards**: Fixed 415px × 208px dimensions with hover effects
- **Buttons**: Orange primary, ghost secondary, destructive red
- **Typography**: Inter font family with multilingual support
- **Icons**: Lucide React, 16px standard size
- **Tags**: Auto-uppercase formatting with consistent styling

### **Dark Mode**
- Fully supported with automatic system detection
- Toggle available in sidebar
- Proper contrast ratios maintained
- Orange theme consistent across light/dark modes

## 🗺 **Roadmap**

### **Completed ✅**
- [x] React + TypeScript migration
- [x] Tailwind CSS + shadcn/ui integration
- [x] Orange theme implementation (#ff8f00)
- [x] **Fixed card dimensions** - Consistent 415px × 208px sizing
- [x] **Auto-uppercase hashtags** - Automatic tag formatting
- [x] **Multilingual text utilities** - Smart truncation for English/Korean
- [x] **GitHub integration** - Repository link in sidebar header
- [x] Inline memo editing feature
- [x] Direct action buttons (no dropdowns)
- [x] Dark mode toggle with orange theme
- [x] URL correction algorithm
- [x] Delete functionality with confirmations
- [x] Search and filtering system
- [x] **Welcome dialog** - First-launch database location guide
- [x] **Database transparency** - Menu access to database location
- [x] **Centralized version management** - Single source of truth system
- [x] **Data backup guidance** - User-friendly backup instructions

### **Planned 🚧**
- [ ] **Browser Extension** - Chrome/Firefox extension for one-click saving
- [ ] **Import/Export** - Backup and restore bookmarks
- [ ] **Advanced Search** - Full-text search with filters
- [ ] **Bulk Operations** - Select multiple bookmarks for actions
- [ ] **Keyboard Navigation** - Full keyboard accessibility
- [ ] **Custom Tags** - Advanced tagging and organization
- [ ] **Analytics Dashboard** - Usage statistics and insights

### **Future Ideas 💡**
- [ ] **Cloud Sync** - Optional cloud backup
- [ ] **Team Sharing** - Collaborative bookmark collections
- [ ] **API Integration** - Connect with other tools
- [ ] **Mobile App** - iOS/Android companion
- [ ] **Web Version** - Browser-based access

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow existing TypeScript patterns
- Use Tailwind CSS for styling
- Maintain shadcn/ui component consistency
- Add proper error handling
- Update documentation as needed

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Electron** - Cross-platform desktop framework
- **React** - UI library and ecosystem
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful component library
- **SQLite** - Reliable local database
- **Developer community** - Inspiration and feedback

---

**Made with 🐱 for developers who love clean, efficient tools**

⭐ **Star this repo** if you find it useful!