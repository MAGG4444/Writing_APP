# Story Forge

Story Forge is a local desktop writing studio for authors who want drafting, outlining, plot planning, tag management, character analysis, and relationship mapping in one app.

## What It Does

Story Forge is built for long-form fiction workflows. It combines the core writing surfaces authors usually have to split across multiple tools:

- A bottom-tab `Storage` workspace for folders, works, and text editing
- A right-side writing tools panel for formatting rules, outline, detailed outline, plot pointers, tags, mind-map notes, and character analysis
- An `Inspiration` page with conversation-style idea capture
- Search and category creation for inspiration posts
- A `Settings` page for app color themes and language switching
- English and Chinese interface support
- Built-in offline English and Chinese fonts
- Responsive layout that adapts to different window sizes
- Local project persistence plus JSON import/export

## Desktop App

The project now runs as a standalone Electron desktop app.

Desktop-specific behavior includes:

- Native desktop window
- App menu for import, export, and reset actions
- File-based JSON import/export through system dialogs
- Packaging support for downloadable builds
- Custom app icon for packaged builds
- Offline bundled typography for desktop use
- Window-size-aware layout that reflows the writing workspace on narrower screens

## Local Development

Install dependencies:

```bash
npm install
```

Start the desktop app:

```bash
npm start
```

## Build Downloadable Packages

Generate distributable builds:

```bash
npm run dist
```

Build artifacts are written to `dist/`.

On Linux, the generated outputs include:

- `Story Forge-1.0.0.AppImage`
- `Story Forge-1.0.0.tar.gz`

Windows and macOS targets are also configured in `package.json`, but those are best built on their native platforms or CI runners for reliable release packaging.

## Fedora Installation

The recommended Fedora path is to use the AppImage build.

Make it executable:

```bash
cd dist
chmod +x "Story Forge-1.0.0.AppImage"
```

Run it directly:

```bash
./"Story Forge-1.0.0.AppImage"
```

If your Fedora environment is missing AppImage runtime support, install FUSE libraries first:

```bash
sudo dnf install fuse fuse-libs
```

If you want to keep it like a normal desktop app, a simple approach is:

```bash
mkdir -p ~/Applications
cp "dist/Story Forge-1.0.0.AppImage" ~/Applications/
chmod +x ~/Applications/"Story Forge-1.0.0.AppImage"
```

Then run it from:

```bash
~/Applications/"Story Forge-1.0.0.AppImage"
```

## Browser Fallback

The app still works as a plain local web app. If needed, you can open `index.html` directly in a browser, but the desktop version is the intended primary experience.

## Typography

The app now bundles its selected open-source fonts locally instead of relying on online font loading.

Included font families:

- `Source Sans 3`
- `Merriweather`
- `Noto Sans SC`
- `Noto Serif SC`

That means packaged desktop builds can render the selected English and Chinese fonts even when offline.

## Project Structure

- `index.html` contains the app shell
- `styles.css` contains the visual system and layout
- `app.js` contains the tab logic, local state handling, themes, and localization
- `main.js` contains the Electron main process
- `preload.js` exposes the safe desktop bridge to the renderer
- `package.json` contains Electron scripts and packaging workflow
- `electron-builder.json` contains package targets and build resource configuration
- `assets/` contains application icon resources
- `assets/fonts/` contains bundled offline font files used by the app
