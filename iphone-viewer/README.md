# iPhone 12 GLB viewer (debug)

Minimal React + Vite + React Three Fiber app that only loads the teardown GLB.

The GLB is **not copied** here: `public/iphone_12_teardown.glb` is a **symlink** to `../public/models/iphone_12_teardown.glb` in the main TeardownHQ app.

## Run

From this folder:

```bash
npm install
npm run dev
```

Open the printed local URL. Orbit: drag to rotate, scroll to zoom.

If the symlink breaks (e.g. on Windows without symlinks), copy the file instead:

`cp ../public/models/iphone_12_teardown.glb public/iphone_12_teardown.glb`
