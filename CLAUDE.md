# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Elegator is a desktop knowledge collection application built with Electron, designed for developers to save, organize, and revisit valuable web links. It combines a Node.js backend with SQLite database and a frontend using vanilla HTML/CSS/JavaScript plus some React/TypeScript components.

## Common Development Commands

```bash
# Development
npm run dev        # Start in development mode (loads test.html, opens DevTools)
npm start          # Start the Electron app

# Building
npm run build-mac  # Build macOS DMG
npm run build-win  # Build Windows installer
npm run build-linux # Build Linux AppImage
npm run pack       # Package without installer

# Maintenance
npm run clean      # Clean node_modules and build files
npm run rebuild    # Rebuild native modules for Electron

# Platform-specific scripts
./scripts/build.sh      # Complete macOS build with dependency installation
./scripts/quick-build.sh # Fast DMG build for development
```

## Architecture Overview

### Process Structure
- **Main Process** (`main.js`): Electron main process handling app lifecycle, windows, IPC, and system integration
- **Renderer Process** (`renderer/`): Frontend UI running in Chromium webviews
- **Preload Script** (`preload.js`): Secure IPC bridge between main and renderer processes
- **Utilities** (`utils/`): Database management and web scraping utilities

### Database Architecture
- **SQLite database** stored in user data directory
- **Dual implementations**:
  - `utils/database-sqlite3.js` - Node.js sqlite3 for main process
  - `utils/database-electron.ts` - better-sqlite3 for TypeScript components
- **Schema**: Single `links` table with columns for URL, title, domain, favicon, memo, tags (JSON), timestamps, and flags

### Frontend Structure
- **Production UI**: `renderer/index.html` + `renderer/app.js`
- **Development UI**: `renderer/test.html` (used in dev mode)
- **Alternative Implementation**: `app.tsx` (React/TypeScript version)
- **Splash Screen**: `renderer/splash.html`

## Key Technical Details

### IPC Communication
The preload script exposes a secure API to the renderer:
- `window.electronAPI.saveLink(linkData)`
- `window.electronAPI.getLinks()`
- `window.electronAPI.updateLink(id, updates)`
- `window.electronAPI.deleteLink(id)`
- Various other methods for app control and data management

### Web Scraping
`utils/scraper.js` handles automatic metadata extraction using Cheerio and Axios:
- Extracts page title, favicon, and domain from URLs
- Handles various favicon formats and fallbacks
- Used when saving new links to populate metadata

### Development vs Production
- **Development mode** (`npm run dev`): Loads `test.html`, opens DevTools automatically
- **Production mode** (`npm start`): Loads `index.html`, no DevTools
- Test for development mode: `process.argv.includes('--dev')`

## Database Schema

```sql
links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  favicon TEXT,
  memo TEXT,
  tags TEXT, -- JSON array stored as string
  created_at TEXT NOT NULL,
  reminder_date TEXT,
  is_favorite INTEGER DEFAULT 0,
  is_completed INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

## Build Configuration

### Electron Builder
Configuration in `package.json` for cross-platform builds:
- **macOS**: DMG with proper signing and notarization setup
- **Windows**: NSIS installer
- **Linux**: AppImage format
- Build output goes to `dist/` directory

### Native Dependencies
- **sqlite3**: Requires rebuilding for Electron (`npm run rebuild`)
- **better-sqlite3**: Alternative SQLite binding for TypeScript components
- Build scripts handle native module rebuilding automatically

## Planned Features

The next major feature is a **browser extension integration**:
- Local Express.js server within the Electron app
- REST API endpoints for link management
- Browser extension to save links directly from toolbar
- Graceful handling when desktop app isn't running

## Important File Locations

- **Main entry**: `main.js`
- **Database utilities**: `utils/database-sqlite3.js`, `utils/database-electron.ts`
- **Frontend logic**: `renderer/app.js`
- **React version**: `app.tsx`
- **Build scripts**: `scripts/` directory
- **Database location**: User data directory (e.g., `~/Library/Application Support/elegator` on macOS)