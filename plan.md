# TeardownHQ — Project Overview

## Project Summary

**TeardownHQ** is a client-side, interactive 3D device teardown viewer built with React, TypeScript, Vite, and React Three Fiber. It lets users explore a 3D model of an iPhone 12, click on parts to learn about them, and see which screws are involved in removal. There is no backend, database, or authentication.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19.2.6 |
| Language | TypeScript | 6.0.2 |
| Build Tool | Vite | 8.0.12 |
| 3D Renderer | Three.js | 0.184.0 |
| React-Three Binding | @react-three/fiber | 9.6.1 |
| 3D Helpers | @react-three/drei | 10.7.7 |
| Linting | ESLint + TypeScript ESLint | 10.x / 8.x |

---

## Directory Structure

```
TeardownHQ/
├── src/
│   ├── components/
│   │   ├── DeviceCanvas.tsx       # Canvas + scene setup
│   │   ├── InfoPanel.tsx          # Sidebar UI
│   │   ├── IPhone12Model.tsx      # GLB loader & mesh logic
│   │   └── PlaceholderDevice.tsx  # Fallback 3D device
│   ├── constants/
│   │   └── model.ts               # GLB URL constant
│   ├── data/
│   │   └── deviceConfig.ts        # Part configs, tools, screws
│   ├── lib/
│   │   └── iphone12PartResolve.ts # Mesh-name → PartId mapping logic
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── App.tsx                    # Root component + state
│   ├── App.css                    # Layout + component styles
│   ├── index.css                  # Design tokens (CSS vars)
│   └── main.tsx                   # React entry point
│
├── iphone-viewer/                 # Standalone debug viewer (mini-app)
│   └── src/ ...                   # Minimal R3F app for GLB inspection
│
├── public/
│   ├── models/
│   │   ├── iphone_12_teardown.glb # 3D model (git-ignored, large file)
│   │   └── README.md
│   ├── favicon.svg
│   └── icons.svg
│
├── dist/                          # Build output
├── index.html
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── package.json
└── .gitignore
```

---

## Key Files & Their Roles

### `src/App.tsx`
- Root component.
- State: `selectedPartId` (PartId | null), `removalIntent` (boolean).
- Renders `<InfoPanel>` (sidebar) and `<DeviceCanvas>` (3D scene).

### `src/components/DeviceCanvas.tsx`
- Wraps `<Canvas>` from React Three Fiber.
- Background: `#e8ebe3`. Ambient + directional light with shadows.
- OrbitControls: minDistance 1.2, maxDistance 14.
- Environment preset: "city".
- Uses `<Suspense>` for async model and HDRI loading.

### `src/components/IPhone12Model.tsx`
- Loads `iphone_12_teardown.glb` with GLTFLoader.
- Clones the scene and traverses all meshes to:
  - Assign PartIds from mesh names via `resolvePartIdFromObject`.
  - Clone materials to allow per-part emissive highlighting.
  - Enable shadows, DoubleSide rendering.
- Highlight color: `#639922`.
- Camera auto-focuses via bounding sphere on mount.
- Click / pointer events: selects part by traversing parent hierarchy.

### `src/components/InfoPanel.tsx`
- Sidebar (or top bar on mobile).
- Shows selected part title, description, tools list.
- Toggle buttons: "Show screws for removal", "Clear selection".
- Displays screw metadata when removal intent is active.

### `src/components/PlaceholderDevice.tsx`
- Simple geometry fallback (RoundedBox) used when no GLB is available.
- Shows placeholder parts and screw positions with `<Html>` labels.

### `src/data/deviceConfig.ts`
- **Types**: `PartId`, `ToolRef`, `ScrewDef`, `PartConfig`.
- **`toolsCatalog`**: p2, ph000, y000, spudger, suction.
- **`parts`**: Config for chassis, display, battery, connector_shield — each with title, description, tools[], screws[].
  - Screw positions are currently placeholder `[0,0,0]`.

### `src/lib/iphone12PartResolve.ts`
- `collectNameChain()`: Walks hierarchy collecting mesh names.
- `isScrewName()`: Detects screw meshes via regex.
- `resolvePartIdFromNames()`: Maps mesh name patterns to PartIds:
  - battery → "battery"
  - front_panel / front_cam → "display"
  - cover_flex / motherboard_cover → "connector_shield"
  - body / backplate / btn_ / speaker → "chassis"
- `resolvePartIdFromObject()`: Convenience wrapper.

### `src/constants/model.ts`
- `IPHONE12_GLB_URL = 'public/models/iphone_12_teardown.glb'`

---

## Design System

### CSS Variables (`index.css`)

| Token | Value |
|---|---|
| `--color-primary` | `#3b6d11` |
| `--color-primary-hover` | `#639922` |
| `--color-tint` | `#eaf3de` |
| `--color-surface` | `#f7f7f5` |
| `--color-text` | `#111111` |
| `--color-muted` | `#5f5e5a` |
| `--color-border` | `#e0e0dc` |
| Font | Inter, system-ui, -apple-system |

### Layout (`App.css`)
- `.app-shell`: Flex row; collapses to column on ≤800px.
- `.info-panel`: `min(380px, 100vw)` width sidebar.
- `.device-canvas`: Flex-grow 3D container.
- Button variants: `.btn--primary`, `.btn--ghost`.

---

## Architecture Notes

- **State management**: Simple `useState` / `useCallback` in App. No Redux or Context.
- **No backend**: 100% client-side. No API, DB, auth, or server-side code.
- **No tests**: No Vitest, Jest, or React Testing Library configured.
- **No Docker / CI**: No deployment config present.
- **Performance**: Material cloning per mesh, GLB preloading, `frustumCulled = false`, RAF-based camera update.
- **Accessibility**: Semantic HTML (`<aside>`, `<header>`, `<section>`, `<footer>`), `aria-label` on info panel.
- **Asset management**: GLB files are git-ignored (large binary). Model requires CC-BY-4.0 attribution (Peter_D on Sketchfab).

---

## NPM Scripts

| Script | Command |
|---|---|
| `dev` | `vite` |
| `build` | `tsc -b && vite build` |
| `lint` | `eslint .` |
| `preview` | `vite preview` |

---

## iphone-viewer Sub-App

A minimal standalone React + Vite + R3F app at `iphone-viewer/` used for debugging the GLB file directly. It symlinks to the main app's GLB. Has its own `package.json` and `node_modules`.

---

## Current Status

- 2 git commits (initial commit + gitignore GLB update).
- Clean working tree, main branch.
- Core viewer is functional: loads GLB, highlights parts on click, shows part info in sidebar.
- Screw positions in `deviceConfig.ts` are placeholder zeros — not yet mapped to real 3D coordinates.
- No tests, no deployment pipeline, no backend.
