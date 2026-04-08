# Story Forge

Story Forge is a local desktop writing studio for authors who want drafting, outlining, plot planning, tag management, character analysis, and relationship mapping in one app.

## What It Does

Story Forge is built for long-form fiction workflows. It combines the core writing surfaces authors usually have to split across multiple tools:

- A main draft editor with quick formatting tools and live preview
- An idea capture page for fragments, notes, and future scenes
- A high-level outline page for major beats
- A detailed outline page for scene-by-scene planning
- Plot pointers for motivations, reveals, stakes, and payoffs
- Tags for themes, revision passes, and thread tracking
- A mind-map view for character relationships and plot connections
- A character panel with a dedicated analysis page for each role
- Local project persistence plus JSON import/export

## Desktop App

The project now runs as a standalone Electron desktop app.

Desktop-specific behavior includes:

- Native desktop window
- App menu for import, export, and reset actions
- File-based JSON import/export through system dialogs
- Packaging support for downloadable builds

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
- `story-forge-1.0.0.tar.gz`

Windows and macOS targets are also configured in `package.json`, but those are best built on their native platforms or CI runners for reliable release packaging.

## Browser Fallback

The app still works as a plain local web app. If needed, you can open `index.html` directly in a browser, but the desktop version is the intended primary experience.

## Project Structure

- `index.html` contains the app shell
- `styles.css` contains the visual system and layout
- `app.js` contains the writing workspace logic and local state handling
- `main.js` contains the Electron main process
- `preload.js` exposes the safe desktop bridge to the renderer
- `package.json` contains Electron scripts and packaging config
