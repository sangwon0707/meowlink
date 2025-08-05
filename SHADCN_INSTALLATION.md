# Shadcn/ui Installation

This document outlines the files created and modified during the manual installation of shadcn/ui.

## Created Files

- `tailwind.config.js`: Tailwind CSS configuration file.
- `postcss.config.js`: PostCSS configuration file.
- `components.json`: Shadcn/ui configuration file.

## Modified Files

- `package.json`: Added dependencies for shadcn/ui, Tailwind CSS, and other utilities.
- `tsconfig.json`: Added a path alias for `@/lib`.
- `src/styles/global.css`: Added Tailwind CSS directives.

## Dependencies Added

- `tailwindcss`
- `postcss`
- `autoprefixer`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`

## To Remove Shadcn/ui

1.  Delete the created files listed above.
2.  Revert the changes in the modified files.
3.  Run `npm uninstall` for the dependencies listed above.