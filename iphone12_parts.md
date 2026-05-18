# iPhone 12 Teardown — Parts Reference (v2: `PART_*` convention)

**Source model:** Sketchfab iPhone 12 teardown.
**Blender file:** `iphone12Teardown.blend` (Documents folder).
**Scene contents:** 215 objects = 1 root empty + 55 `PART_*` group empties + 159 mesh objects. No camera, no light, no animation data.

---

## 1. Naming convention

Hierarchy is now flat under the root, with every iPhone part wrapped in its own `PART_*` group empty:

```
iphone12_teardown                ← root empty (do NOT apply transforms / collapse this)
├── PART_Battery                 ← group empty (move this to move the whole battery)
│   ├── Battery_metal            ← mesh (origin set to its own geometry)
│   ├── Battery_parts            ← mesh
│   └── Battery_plastic_parts    ← mesh
├── PART_Display
│   ├── Display_glass
│   ├── Display_metal
│   ├── ... etc.
└── ...
```

Rules used to generate the names:
- Group empty: `PART_<CamelCasePartName>`
- Child mesh: `<PartName>_<material>` (material taken from the original `*_mat_<material>_0` suffix — `metal`, `glass`, `parts`, `plastic_parts`, `color_body`, `color_housing`, `color_plastic`, `screen`, `screen_plastic`)
- Duplicates within a group (e.g., four front-panel screws) get a numeric suffix: `FrontPanelScrews_metal`, `FrontPanelScrews_metal2`, `…3`, `…4`.

Mesh-level state in the file:
- **Origin** is set to each mesh's own geometry center (`Set Origin → Origin to Geometry → Median`).
- **All Transforms applied** on every mesh (loc/rot/scale baked into mesh data; mesh's basis transform is identity-with-origin-offset).
- `PART_*` empties sit at world origin; moving them rigidly translates all child meshes.
- `iphone12_teardown` root is intentionally **not** flattened — it preserves the hierarchy that lets the assembled phone behave as one object.

---

## 2. Parts grouped by zone

### 2.1 FRONT-facing zone (screen side)

| `PART_*` group | Child meshes | Real iPhone 12 part |
|---|---|---|
| `PART_Display` | `Display_glass`, `Display_metal`, `Display_parts`, `Display_plastic_parts`, `Display_screen`, `Display_screen_plastic` | Front cover glass + OLED + display frame |
| `PART_EarSpeaker` | `EarSpeaker_metal`, `EarSpeaker_parts`, `EarSpeaker_plastic_parts` | Top earpiece speaker module |
| `PART_FrontCam` | `FrontCam_metal`, `FrontCam_parts`, `FrontCam_plastic_parts` | TrueDepth / front-facing camera |
| `PART_FrontCamBracket` | `FrontCamBracket_metal`, `FrontCamBracket_plastic_parts` | Metal bracket holding the front-cam |
| `PART_FrontSensor` | `FrontSensor_metal`, `FrontSensor_parts`, `FrontSensor_plastic_parts` | Proximity + ambient-light + Face ID dot-projector |
| `PART_InsideCamHolder` | `InsideCamHolder_metal` | Inner plastic mount for the front-cam assembly |
| `PART_FrontPanelScrews` | `FrontPanelScrews_metal`, `…metal2`, `…metal3`, `…metal4` | 4 × Y000 tri-point display-bracket screws |

### 2.2 BACK-facing zone (rear glass + camera island)

| `PART_*` group | Child meshes | Real iPhone 12 part |
|---|---|---|
| `PART_BackCover` | `BackCover_color_body`, `BackCover_metal` | Rear glass panel of the iPhone |
| `PART_BackCamGlass` | `BackCamGlass_color_body`, `BackCamGlass_metal`, `BackCamGlass_parts` | Sapphire/glass cover over the rear camera bump |
| `PART_BackCamHole1` | `BackCamHole1_color_body`, `BackCamHole1_glass`, `BackCamHole1_plastic_parts`, `BackCamHole1_screen_plastic` | Wide-angle camera lens ring |
| `PART_BackCamHole2` | `BackCamHole2_color_body`, `BackCamHole2_glass`, `BackCamHole2_plastic_parts`, `BackCamHole2_screen_plastic` | Ultra-wide camera lens ring |
| `PART_BackCamFlashlightHole` | `BackCamFlashlightHole_glass`, `BackCamFlashlightHole_plastic_parts` | LED flash + mic cutout in camera bump |
| `PART_FlashlightDummy` | `FlashlightDummy_parts`, `FlashlightDummy_plastic_parts` | Cosmetic flash-lens placeholder |
| `PART_BackCam` | `BackCam_metal`, `BackCam_parts`, `BackCam_plastic_parts` | Rear dual-camera module |
| `PART_BackCamCover` | `BackCamCover_metal` | Inner shroud/bracket around the rear-cam module |
| `PART_Flashlight` | `Flashlight_metal`, `Flashlight_parts`, `Flashlight_plastic_parts` | True-tone LED flash module |
| `PART_WirelessCharge` | `WirelessCharge_metal`, `WirelessCharge_parts`, `WirelessCharge_plastic_parts` | Qi / MagSafe wireless-charging coil |
| `PART_Magnets` | `Magnets_metal` | MagSafe magnet ring |

### 2.3 OUTSIDE / side-facing zone (aluminum frame + buttons + SIM)

| `PART_*` group | Child meshes | Real iPhone 12 part |
|---|---|---|
| `PART_FrameTop` | `FrameTop_color_housing` | Top edge of the aluminum mid-frame |
| `PART_FrameBottom` | `FrameBottom_color_housing` | Bottom edge of the frame (Lightning side) |
| `PART_FrameLeft` | `FrameLeft_color_housing` | Left side rail of the frame |
| `PART_FrameRight` | `FrameRight_color_housing` | Right side rail of the frame |
| `PART_FrameAntennaInserts` | `FrameAntennaInserts_color_plastic` | Plastic antenna-line inserts in the metal frame |
| `PART_PowerButton` | `PowerButton_color_housing` | Side power / sleep button |
| `PART_VolumeUpButton` | `VolumeUpButton_color_housing` | Volume-Up button (left side) |
| `PART_VolumeDownButton` | `VolumeDownButton_color_housing` | Volume-Down button (left side) |
| `PART_MuteSwitch` | `MuteSwitch_color_housing`, `MuteSwitch_parts` | Ring/Silent mute switch |
| `PART_SimTray` | `SimTray_color_housing`, `SimTray_plastic_parts` | Nano-SIM tray (removable) |
| `PART_PentalobeScrews` | `PentalobeScrews_metal`, `PentalobeScrews_plastic_parts` | 2 × P2 pentalobe screws at bottom edge |

### 2.4 INSIDE — Logic-board area

| `PART_*` group | Child meshes | Real iPhone 12 part |
|---|---|---|
| `PART_Motherboard` | `Motherboard_metal`, `Motherboard_parts`, `Motherboard_plastic_parts` | Main logic board (A14 Bionic, RAM, modem, NAND) |
| `PART_MotherboardCover` | `MotherboardCover_metal` | Metal shield/bracket over the motherboard |
| `PART_MotherboardCablesCover` | `MotherboardCablesCover_metal` | Cover over flex-cable connectors |
| `PART_CoverFlexCables` | `CoverFlexCables_metal` | Flex-cable EMI cover plate |
| `PART_Cover` | `Cover_metal` | Generic shielding cover plate |
| `PART_Backplate` | `Backplate_metal`, `Backplate_parts` | Steel backplate / mid-board shield |

### 2.5 INSIDE — Battery & power

| `PART_*` group | Child meshes | Real iPhone 12 part |
|---|---|---|
| `PART_Battery` | `Battery_metal`, `Battery_parts`, `Battery_plastic_parts` | 2,815 mAh L-shaped Li-ion battery |
| `PART_ChargingPort` | `ChargingPort_color_plastic`, `ChargingPort_metal`, `ChargingPort_plastic_parts` | Lightning connector flex/board |
| `PART_InsidePowerPort` | `InsidePowerPort_metal` | Internal Lightning-port mount/shield |
| `PART_ChargingCable` | `ChargingCable_metal`, `ChargingCable_parts`, `ChargingCable_plastic_parts` | Internal flex cable from Lightning port to motherboard |

### 2.6 INSIDE — Audio & haptics

| `PART_*` group | Child meshes | Real iPhone 12 part |
|---|---|---|
| `PART_Speaker` | `Speaker_metal`, `Speaker_plastic_parts` | Loud-speaker module (bottom edge) |
| `PART_SpeakerCover` | `SpeakerCover_parts`, `SpeakerCover_plastic_parts` | Cover over the loud-speaker |
| `PART_Mic` | `Mic_metal`, `Mic_plastic_parts` | Microphone module |
| `PART_TapticEngine` | `TapticEngine_metal`, `TapticEngine_parts`, `TapticEngine_plastic_parts` | Taptic Engine (linear haptic actuator) |

### 2.7 INSIDE — Antennas, SIM reader, shielding, adhesive, button gears

| `PART_*` group | Child meshes | Real iPhone 12 part |
|---|---|---|
| `PART_CellularAntenna` | `CellularAntenna_metal`, `CellularAntenna_parts`, `CellularAntenna_plastic_parts` | Cellular antenna assembly |
| `PART_WifiAntenna` | `WifiAntenna_metal`, `WifiAntenna_parts`, `WifiAntenna_plastic_parts` | Wi-Fi + Bluetooth antenna assembly |
| `PART_GridWires` | `GridWires_parts` | Internal grounding / shielding grid wires |
| `PART_SimReader` | `SimReader_metal`, `SimReader_parts`, `SimReader_plastic_parts` | Internal SIM-tray reader / cage |
| `PART_SimReaderCableCover` | `SimReaderCableCover_metal` | Flex cover for SIM-tray reader |
| `PART_InnerShell` | `InnerShell_color_plastic` | Inner plastic shell / lining of chassis |
| `PART_AdhesiveSeal` | `AdhesiveSeal_plastic_parts` | Pre-cut adhesive gasket (back-cover + display seal) |
| `PART_PowerButtonGears` | `PowerButtonGears_metal`, `PowerButtonGears_plastic_parts` | Power-button internal clicker mechanism |
| `PART_VolumeUpButtonGears` | `VolumeUpButtonGears_metal`, `VolumeUpButtonGears_plastic_parts` | Vol-Up internal clicker |
| `PART_VolumeDownButtonGears` | `VolumeDownButtonGears_metal`, `VolumeDownButtonGears_plastic_parts` | Vol-Down internal clicker |

### 2.8 Fasteners (grouped screws)

| `PART_*` group | Child meshes | Real iPhone 12 part |
|---|---|---|
| `PART_PentalobeScrews` | `PentalobeScrews_metal`, `PentalobeScrews_plastic_parts` | 2 × P2 pentalobe screws (bottom edge) |
| `PART_FrontPanelScrews` | `FrontPanelScrews_metal`, `…metal2`, `…metal3`, `…metal4` | 4 × Y000 display-bracket screws |
| `PART_SpecialScrews` | `SpecialScrews_metal`, `SpecialScrews_metal2`, `SpecialScrews_metal3` | Standoff / specialty screws (3 unique types) |
| `PART_ChassisScrews` | `ChassisScrews_metal` … `ChassisScrews_metal45` (45 meshes) | All generic numbered chassis screws (~Phillips #000 / Y000) |

---

## 3. Complete alphabetical index of `PART_*` groups

`PART_AdhesiveSeal`, `PART_BackCam`, `PART_BackCamCover`, `PART_BackCamFlashlightHole`, `PART_BackCamGlass`, `PART_BackCamHole1`, `PART_BackCamHole2`, `PART_BackCover`, `PART_Backplate`, `PART_Battery`, `PART_CellularAntenna`, `PART_ChargingCable`, `PART_ChargingPort`, `PART_ChassisScrews`, `PART_Cover`, `PART_CoverFlexCables`, `PART_Display`, `PART_EarSpeaker`, `PART_Flashlight`, `PART_FlashlightDummy`, `PART_FrameAntennaInserts`, `PART_FrameBottom`, `PART_FrameLeft`, `PART_FrameRight`, `PART_FrameTop`, `PART_FrontCam`, `PART_FrontCamBracket`, `PART_FrontPanelScrews`, `PART_FrontSensor`, `PART_GridWires`, `PART_InnerShell`, `PART_InsideCamHolder`, `PART_InsidePowerPort`, `PART_Magnets`, `PART_Mic`, `PART_Motherboard`, `PART_MotherboardCablesCover`, `PART_MotherboardCover`, `PART_MuteSwitch`, `PART_PentalobeScrews`, `PART_PowerButton`, `PART_PowerButtonGears`, `PART_SimReader`, `PART_SimReaderCableCover`, `PART_SimTray`, `PART_Speaker`, `PART_SpeakerCover`, `PART_SpecialScrews`, `PART_TapticEngine`, `PART_VolumeDownButton`, `PART_VolumeDownButtonGears`, `PART_VolumeUpButton`, `PART_VolumeUpButtonGears`, `PART_WifiAntenna`, `PART_WirelessCharge`

**Total `PART_*` groups: 55.**

---

## 4. Counts

| Category | Count |
|---|---|
| Zone — Front-facing | 7 |
| Zone — Back-facing | 11 |
| Zone — Outside / side | 11 |
| Zone — Inside (logic board) | 6 |
| Zone — Inside (battery & power) | 4 |
| Zone — Inside (audio & haptics) | 4 |
| Zone — Inside (antennas, SIM reader, shielding, adhesive, button gears) | 10 |
| Fasteners (grouped) | 2 (overlap with above) |
| **Total `PART_*` groups** | **55** |
| Total mesh objects | 159 |
| Total scene objects (incl. root) | 215 |

---

## 5. How to "speak" to this model programmatically

Any agent that can look up `PART_<Name>` directly maps to a part documented above. Suggested usage:

```python
# In Blender:
import bpy
battery = bpy.data.objects["PART_Battery"]
battery.location.z += 0.05   # move the whole battery 5 cm up — meshes follow
```

The string after `PART_` in this document is **identical** to the Blender object name. No `.001` suffixes, no FBX wrapper layers.

---

## 6. Workflow performed (for reproducibility)

1. Removed all animation data (93 animated objects + 1 action).
2. Deleted the Sketchfab camera and light.
3. Built a `<source-empty> → PART_<Name>` mapping covering all 159 meshes.
4. Created 55 `PART_*` empties under `iphone12_teardown`, re-parented every mesh.
5. Renamed meshes to `<PartName>_<material>` (with numeric suffix for duplicates).
6. **Applied All Transforms** on every mesh.
7. **Set Origin → Origin to Geometry (Median)** on every mesh.
8. Deleted 317 obsolete wrapper empties (the original FBX hierarchy).
9. Re-saved as `iphone12Teardown.blend`.

The root `iphone12_teardown` empty was deliberately preserved (it is the only top-level object) — never apply transforms on it directly, or the per-part origins lose their context.
