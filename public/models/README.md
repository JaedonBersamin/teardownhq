# Device models

- **`iphone_12_teardown.glb`** — loaded by the app from `/models/iphone_12_teardown.glb` (see `IPhone12Model.tsx`).  
  **License:** CC-BY-4.0 (Sketchfab). Keep attribution in the app and README.

**Download on your LAN:** run `npm run dev` (uses `--host`). On another device, open the **Network** URL from the terminal, then use **Download GLB** in the sidebar or go directly to:

`http://<your-computer-ip>:5173/models/iphone_12_teardown.glb`

To swap devices later, add another `.glb` here and point `useGLTF` at `/models/your-file.glb`, plus a new resolver or extended `PartId` map.
