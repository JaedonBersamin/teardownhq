export type PartId =
  // Battery
  | 'battery'

  // Motherboard
  | 'motherboard'
  | 'motherboard_cover'
  | 'motherboard_cables_cover'

  // Display Assembly
  | 'front_panel'
  | 'front_panel_screw01'
  | 'front_panel_screw02'
  | 'front_panel_screw03'
  | 'front_panel_screw04'

  // Back Housing
  | 'back_cover'
  | 'backplate'
  | 'inside_body'
  | 'profile_housing_top'
  | 'profile_housing_bottom'
  | 'profile_housing_left'
  | 'profile_housing_right'
  | 'profile_housing_dummies'

  // Wireless Charging
  | 'wireless_charge'
  | 'magnets'

  // Rear Camera System
  | 'back_cam'
  | 'back_cam_cover'
  | 'back_cam_glass'
  | 'back_cam_hole1'
  | 'back_cam_hole2'
  | 'back_cam_flashlight_hole'
  | 'inside_cam_holder'
  | 'flashlight'
  | 'flashlight_dummy'

  // Front Camera & Sensors
  | 'front_cam'
  | 'front_cam_bracket'
  | 'front_sensor'

  // Audio
  | 'earspeaker'
  | 'speaker'
  | 'speaker_cover'
  | 'mic'

  // Taptic Engine
  | 'taptic'

  // Buttons
  | 'btn_off'
  | 'btn_off_gears'
  | 'btn_volume_up'
  | 'btn_volume_up_gears'
  | 'btn_volume_down'
  | 'btn_volume_down_gears'
  | 'btn_volume_off'

  // Ports & Connectors
  | 'charging_port'
  | 'charging_cable'
  | 'inside_power_port'
  | 'simholder'
  | 'simholder_box'
  | 'simholder_cable_cover'

  // Antenna
  | 'antenn'
  | 'wifi_antenn'

  // Covers & Flex
  | 'cover'
  | 'cover_flex_cables'
  | 'grid_wires'
  | 'glue_sticker'

  // Screws
  | 'screw_pentalobe'
  | 'chassis_screws'
  | 'special_screws'

export type ToolRef = {
  id: string
  label: string
  /** Plain or affiliate URL when you have one */
  purchaseUrl?: string
}

export type ScrewDef = {
  id: string
  typeLabel: string
  /** Position relative to the device placeholder group */
  position: [number, number, number]
}

export type PartConfig = {
  id: PartId
  title: string
  description: string
  tools: ToolRef[]
  /** Shown when "removal intent" is on — swap for real coords when you load a GLB */
  screws: ScrewDef[]
  requires: PartId[]
}

export const toolsCatalog: Record<string, ToolRef> = {
  p2:       { id: 'p2',       label: 'P2 Pentalobe driver' },
  ph00:     { id: 'ph00',     label: 'Phillips #00 screwdriver' },
  y000:     { id: 'y000',     label: 'Tri-point Y000 driver' },
  standoff: { id: 'standoff', label: '2.5 mm standoff driver' },
  spudger:  { id: 'spudger',  label: 'Plastic spudger' },
  suction:  { id: 'suction',  label: 'Suction cup' },
  tweezers: { id: 'tweezers', label: 'ESD tweezers' },
  iopener:  { id: 'iopener',  label: 'iOpener / heat gun' },
}

export const parts: Record<PartId, PartConfig> = {
  // ── Step 1: Entry screws ──────────────────────────────────────────────────
  screw_pentalobe: {
    id: 'screw_pentalobe',
    title: 'Pentalobe Screws',
    description: 'The 2 P2 pentalobe screws at the bottom edge of the phone either side of the Lightning port. Always the first screws out and the last back in.',
    tools: [toolsCatalog.p2],
    screws: [],
    requires: [],
  },

  // SIM tray can come out at any point before deeper work
  simholder: {
    id: 'simholder',
    title: 'SIM Tray',
    description: 'Nano-SIM card tray. Eject with a SIM pin before any other disassembly step.',
    tools: [],
    screws: [],
    requires: [],
  },

  // ── Step 2: Display bracket screws (inside, after cracking open the phone) ─
  // ── Step 2: Lift display ──────────────────────────────────────────────────
  front_panel: {
    id: 'front_panel',
    title: 'Front Panel',
    description: 'OLED Super Retina XDR display module with digitizer and front glass. Opens like a book from the bottom edge — hinge is at the top.',
    tools: [toolsCatalog.p2, toolsCatalog.iopener, toolsCatalog.suction, toolsCatalog.spudger],
    screws: [],
    requires: ['screw_pentalobe'],
  },

  // ── Step 3: Bracket screws (revealed after display lifts away) ────────────
  front_panel_screw01: {
    id: 'front_panel_screw01',
    title: 'Display Bracket Screw 1',
    description: 'Y000 tri-point screw securing the display connector bracket.',
    tools: [toolsCatalog.y000],
    screws: [],
    requires: ['front_panel'],
  },
  front_panel_screw02: {
    id: 'front_panel_screw02',
    title: 'Display Bracket Screw 2',
    description: 'Y000 tri-point screw securing the display connector bracket.',
    tools: [toolsCatalog.y000],
    screws: [],
    requires: ['front_panel'],
  },
  front_panel_screw03: {
    id: 'front_panel_screw03',
    title: 'Display Bracket Screw 3',
    description: 'Y000 tri-point screw securing the display connector bracket.',
    tools: [toolsCatalog.y000],
    screws: [],
    requires: ['front_panel'],
  },
  front_panel_screw04: {
    id: 'front_panel_screw04',
    title: 'Display Bracket Screw 4',
    description: 'Y000 tri-point screw securing the display connector bracket.',
    tools: [toolsCatalog.y000],
    screws: [],
    requires: ['front_panel'],
  },

  // ── Step 4: Disconnect battery (safety — always first thing after opening) ─
  motherboard_cables_cover: {
    id: 'motherboard_cables_cover',
    title: 'Motherboard Cables Cover',
    description: 'Metal retaining bracket that locks the flex cable connectors to the board.',
    tools: [toolsCatalog.y000],
    screws: [],
    requires: ['front_panel'],
  },
  battery: {
    id: 'battery',
    title: 'Battery',
    description: '2,815 mAh Li-Ion pack held by 3 stretch-release adhesive strips. Disconnect before any deeper work.',
    tools: [toolsCatalog.spudger, toolsCatalog.tweezers],
    screws: [],
    requires: ['front_panel', 'motherboard_cables_cover'],
  },

  // ── Step 5: Internal chassis screws (only reachable with display off and battery disconnected) ─
  chassis_screws: {
    id: 'chassis_screws',
    title: 'Chassis Screws',
    description: '~44 internal Phillips and tri-point screws throughout the assembly. Critical: screws are not interchangeable — wrong-length screws can puncture the OLED or short the board.',
    tools: [toolsCatalog.ph00, toolsCatalog.y000],
    screws: [],
    requires: ['front_panel', 'battery'],
  },
  special_screws: {
    id: 'special_screws',
    title: 'Standoff Screws',
    description: 'Non-standard 2.5 mm standoff screws used at the SIM reader, logic board, and charging port assembly.',
    tools: [toolsCatalog.standoff],
    screws: [],
    requires: ['front_panel', 'battery'],
  },

  // ── Step 6: Shielding / cable covers ─────────────────────────────────────
  cover: {
    id: 'cover',
    title: 'Upper Shield Cover',
    description: 'Upper metal shielding cover over the flex cable area near the top of the board.',
    tools: [toolsCatalog.y000, toolsCatalog.spudger],
    screws: [],
    requires: ['front_panel', 'battery', 'chassis_screws'],
  },
  cover_flex_cables: {
    id: 'cover_flex_cables',
    title: 'Flex Cable Cover',
    description: 'Shielding bracket specifically over the flex cable routing area.',
    tools: [toolsCatalog.y000],
    screws: [],
    requires: ['front_panel', 'battery', 'chassis_screws'],
  },
  motherboard_cover: {
    id: 'motherboard_cover',
    title: 'Motherboard Cover',
    description: 'EMI/RF shielding can sitting directly over the logic board.',
    tools: [toolsCatalog.y000, toolsCatalog.spudger],
    screws: [],
    requires: ['front_panel', 'battery', 'chassis_screws'],
  },

  // ── Step 7: Rear camera system ────────────────────────────────────────────
  back_cam_cover: {
    id: 'back_cam_cover',
    title: 'Rear Camera Cover',
    description: 'Metal shielding and retaining bracket over the rear camera module.',
    tools: [toolsCatalog.ph00],
    screws: [],
    requires: ['front_panel', 'battery', 'chassis_screws'],
  },
  back_cam: {
    id: 'back_cam',
    title: 'Rear Camera Module',
    description: 'Dual rear camera module (Wide + Ultra-Wide). Secured by a bracket with 4 Phillips screws.',
    tools: [toolsCatalog.ph00, toolsCatalog.spudger],
    screws: [],
    requires: ['back_cam_cover'],
  },
  inside_cam_holder: {
    id: 'inside_cam_holder',
    title: 'Camera Holder Bracket',
    description: 'Internal metal bracket securing the rear camera module to the chassis.',
    tools: [toolsCatalog.ph00],
    screws: [],
    requires: ['back_cam'],
  },
  flashlight: {
    id: 'flashlight',
    title: 'Rear Flash Module',
    description: 'Dual-LED True Tone flash assembly. Shares a connector with the rear camera.',
    tools: [toolsCatalog.ph00, toolsCatalog.spudger],
    screws: [],
    requires: ['front_panel', 'battery', 'chassis_screws'],
  },
  flashlight_dummy: {
    id: 'flashlight_dummy',
    title: 'Flash Cavity Placeholder',
    description: 'Placeholder geometry filling the flashlight cavity.',
    tools: [],
    screws: [],
    requires: ['flashlight'],
  },
  // Camera bump glass/apertures are bonded to the back cover — only relevant when the back is off
  back_cam_glass: {
    id: 'back_cam_glass',
    title: 'Camera Bump Glass',
    description: 'Sapphire lens cover glass on the camera bump. Stays with the back glass — do not pry unless replacing the back cover.',
    tools: [],
    screws: [],
    requires: ['back_cover'],
  },
  back_cam_hole1: {
    id: 'back_cam_hole1',
    title: 'Camera Lens Aperture 1',
    description: 'First camera lens opening with glass cover in the camera bump.',
    tools: [],
    screws: [],
    requires: ['back_cover'],
  },
  back_cam_hole2: {
    id: 'back_cam_hole2',
    title: 'Camera Lens Aperture 2',
    description: 'Second camera lens opening with glass cover in the camera bump.',
    tools: [],
    screws: [],
    requires: ['back_cover'],
  },
  back_cam_flashlight_hole: {
    id: 'back_cam_flashlight_hole',
    title: 'Flash Aperture',
    description: 'Flashlight opening with lens cover in the camera bump.',
    tools: [],
    screws: [],
    requires: ['back_cover'],
  },

  // ── Step 8: SIM socket ────────────────────────────────────────────────────
  simholder_cable_cover: {
    id: 'simholder_cable_cover',
    title: 'SIM Cable Cover',
    description: 'Metal retaining bracket over the SIM reader flex cable.',
    tools: [toolsCatalog.y000],
    screws: [],
    requires: ['front_panel', 'battery', 'chassis_screws'],
  },
  simholder_box: {
    id: 'simholder_box',
    title: 'SIM Tray Socket',
    description: 'Internal SIM tray receptacle. The tiny silver gasket inside is the waterproof seal — do not lose it.',
    tools: [toolsCatalog.ph00, toolsCatalog.standoff],
    screws: [],
    requires: ['simholder_cable_cover', 'special_screws'],
  },

  // ── Step 9: Taptic Engine ─────────────────────────────────────────────────
  taptic: {
    id: 'taptic',
    title: 'Taptic Engine',
    description: 'Linear resonant actuator for haptic feedback. Strong magnet — lift straight up to avoid snapping to nearby metal.',
    tools: [toolsCatalog.ph00, toolsCatalog.standoff, toolsCatalog.spudger],
    screws: [],
    requires: ['front_panel', 'battery', 'chassis_screws', 'special_screws'],
  },

  // ── Step 10: Bottom speaker ───────────────────────────────────────────────
  speaker_cover: {
    id: 'speaker_cover',
    title: 'Speaker Cover',
    description: 'Protective grille and bracket over the bottom speaker. Note the orange rubber gasket — it is the audio port waterproof seal.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['front_panel', 'battery', 'chassis_screws'],
  },
  speaker: {
    id: 'speaker',
    title: 'Bottom Speaker',
    description: 'Bottom stereo speaker module. Contacts the board via spring contacts — no connector to unplug.',
    tools: [toolsCatalog.ph00],
    screws: [],
    requires: ['speaker_cover', 'taptic'],
  },
  mic: {
    id: 'mic',
    title: 'Microphone',
    description: 'Bottom microphone assembly integrated into the speaker module area.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['speaker'],
  },

  // ── Step 11: Motherboard ──────────────────────────────────────────────────
  motherboard: {
    id: 'motherboard',
    title: 'Motherboard',
    description: 'Main logic board carrying the A14 Bionic SoC, 5G modem, LPDDR4X RAM, and NAND flash.',
    tools: [toolsCatalog.ph00, toolsCatalog.standoff, toolsCatalog.spudger],
    screws: [],
    requires: [
      'front_panel', 'battery',
      'back_cam', 'simholder_box',
      'cover', 'cover_flex_cables', 'motherboard_cables_cover', 'motherboard_cover',
      'chassis_screws', 'special_screws',
      'taptic', 'speaker',
    ],
  },

  // ── Step 12: Charging port ────────────────────────────────────────────────
  charging_port: {
    id: 'charging_port',
    title: 'Lightning Port',
    description: 'Bottom Lightning connector module with housing. Also carries the secondary microphone and antenna feed.',
    tools: [toolsCatalog.ph00, toolsCatalog.standoff, toolsCatalog.spudger],
    screws: [],
    requires: ['motherboard', 'chassis_screws', 'special_screws'],
  },
  charging_cable: {
    id: 'charging_cable',
    title: 'Charging Cable Flex',
    description: 'Flex cable running from the Lightning port up to the logic board.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['charging_port'],
  },
  inside_power_port: {
    id: 'inside_power_port',
    title: 'Lightning Port Bracket',
    description: 'Internal mount bracket securing the Lightning connector to the chassis.',
    tools: [toolsCatalog.ph00],
    screws: [],
    requires: ['charging_port'],
  },

  // ── Step 13: Wireless charging coil and magnets ───────────────────────────
  wireless_charge: {
    id: 'wireless_charge',
    title: 'Wireless Charging Coil',
    description: 'MagSafe / Qi wireless charging coil assembly. Adhesive-mounted behind the rear glass.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['motherboard'],
  },
  magnets: {
    id: 'magnets',
    title: 'MagSafe Magnet Ring',
    description: 'Ring of 18 magnets behind the wireless coil that align and hold MagSafe accessories.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['wireless_charge'],
  },

  // ── Step 14: Antenna flex assemblies ─────────────────────────────────────
  antenn: {
    id: 'antenn',
    title: 'Cellular Antenna',
    description: 'Cellular / Bluetooth / GPS antenna flex assembly routing along the frame.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['motherboard', 'charging_port'],
  },
  wifi_antenn: {
    id: 'wifi_antenn',
    title: 'Wi-Fi Antenna',
    description: 'Wi-Fi / NFC antenna module.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['motherboard', 'charging_port'],
  },

  // ── Step 15: Buttons ──────────────────────────────────────────────────────
  btn_off_gears: {
    id: 'btn_off_gears',
    title: 'Power Button Mechanism',
    description: 'Internal spring and clicker mechanism for the power button.',
    tools: [toolsCatalog.ph00, toolsCatalog.spudger],
    screws: [],
    requires: ['motherboard', 'charging_port'],
  },
  btn_off: {
    id: 'btn_off',
    title: 'Power Button',
    description: 'Right-side power / lock button cap.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['btn_off_gears'],
  },
  btn_volume_up_gears: {
    id: 'btn_volume_up_gears',
    title: 'Volume Up Mechanism',
    description: 'Internal spring and clicker mechanism for the volume up button.',
    tools: [toolsCatalog.ph00, toolsCatalog.spudger],
    screws: [],
    requires: ['motherboard', 'charging_port'],
  },
  btn_volume_up: {
    id: 'btn_volume_up',
    title: 'Volume Up Button',
    description: 'Left-side volume up button cap.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['btn_volume_up_gears'],
  },
  btn_volume_down_gears: {
    id: 'btn_volume_down_gears',
    title: 'Volume Down Mechanism',
    description: 'Internal spring and clicker mechanism for the volume down button.',
    tools: [toolsCatalog.ph00, toolsCatalog.spudger],
    screws: [],
    requires: ['motherboard', 'charging_port'],
  },
  btn_volume_down: {
    id: 'btn_volume_down',
    title: 'Volume Down Button',
    description: 'Left-side volume down button cap.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['btn_volume_down_gears'],
  },
  btn_volume_off: {
    id: 'btn_volume_off',
    title: 'Mute Switch',
    description: 'Ring / Silent toggle switch on the left edge. Most fragile flex in the phone — handle by the plastic stiffener only.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['motherboard', 'charging_port'],
  },

  // ── Step 16: Frame rails (phone fully gutted) ─────────────────────────────
  profile_housing_top: {
    id: 'profile_housing_top',
    title: 'Frame — Top Rail',
    description: 'Top segment of the aluminum mid-frame rail.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['motherboard', 'charging_port', 'antenn', 'wifi_antenn', 'wireless_charge', 'btn_off', 'btn_volume_up', 'btn_volume_down', 'btn_volume_off'],
  },
  profile_housing_bottom: {
    id: 'profile_housing_bottom',
    title: 'Frame — Bottom Rail',
    description: 'Bottom segment of the aluminum mid-frame rail.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['motherboard', 'charging_port', 'antenn', 'wifi_antenn', 'wireless_charge', 'btn_off', 'btn_volume_up', 'btn_volume_down', 'btn_volume_off'],
  },
  profile_housing_left: {
    id: 'profile_housing_left',
    title: 'Frame — Left Rail',
    description: 'Left segment of the aluminum mid-frame rail.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['motherboard', 'charging_port', 'antenn', 'wifi_antenn', 'wireless_charge', 'btn_off', 'btn_volume_up', 'btn_volume_down', 'btn_volume_off'],
  },
  profile_housing_right: {
    id: 'profile_housing_right',
    title: 'Frame — Right Rail',
    description: 'Right segment of the aluminum mid-frame rail.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['motherboard', 'charging_port', 'antenn', 'wifi_antenn', 'wireless_charge', 'btn_off', 'btn_volume_up', 'btn_volume_down', 'btn_volume_off'],
  },
  profile_housing_dummies: {
    id: 'profile_housing_dummies',
    title: 'Antenna Break Fillers',
    description: 'Plastic inserts in the aluminum frame that act as antenna breaks for RF signal.',
    tools: [],
    screws: [],
    requires: ['profile_housing_top'],
  },

  // ── Step 17: Back housing ─────────────────────────────────────────────────
  back_cover: {
    id: 'back_cover',
    title: 'Back Cover',
    description: 'Ceramic Shield rear glass panel with embedded Apple logo. Bonded to the mid-frame with industrial adhesive — requires full disassembly to replace.',
    tools: [toolsCatalog.iopener, toolsCatalog.spudger],
    screws: [],
    requires: ['profile_housing_top', 'profile_housing_bottom', 'profile_housing_left', 'profile_housing_right'],
  },
  backplate: {
    id: 'backplate',
    title: 'Backplate',
    description: 'Internal aluminum mid-frame structural plate that the logic board mounts to.',
    tools: [toolsCatalog.ph00, toolsCatalog.spudger],
    screws: [],
    requires: ['back_cover'],
  },
  inside_body: {
    id: 'inside_body',
    title: 'Inside Body',
    description: 'Interior chassis cavity walls and structural geometry.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['backplate'],
  },

  // ── Display sub-components (accessible once front panel is off) ───────────
  front_cam_bracket: {
    id: 'front_cam_bracket',
    title: 'Front Camera Bracket',
    description: 'Mounting bracket securing the front camera to the display assembly.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['front_panel'],
  },
  front_cam: {
    id: 'front_cam',
    title: 'Front Camera',
    description: 'TrueDepth front camera sensor array. Paired to the Secure Enclave — replacing it from another device permanently disables Face ID.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['front_panel'],
  },
  front_sensor: {
    id: 'front_sensor',
    title: 'Face ID Sensor Module',
    description: 'Flood illuminator, dot projector, and IR camera for Face ID. Factory-paired — swapping disables Face ID permanently.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['front_panel', 'front_cam_bracket'],
  },
  earspeaker: {
    id: 'earspeaker',
    title: 'Earpiece Speaker',
    description: 'Top earpiece speaker module, part of the display assembly.',
    tools: [toolsCatalog.spudger],
    screws: [],
    requires: ['front_panel'],
  },

  // ── Misc internal ─────────────────────────────────────────────────────────
  grid_wires: {
    id: 'grid_wires',
    title: 'Grid Wires',
    description: 'Internal wire mesh representing EMI shielding and grounding wire routing.',
    tools: [],
    screws: [],
    requires: ['motherboard'],
  },
  glue_sticker: {
    id: 'glue_sticker',
    title: 'Adhesive Strip',
    description: 'Adhesive gasket used to seal the display or secure the battery. Replace with a fresh strip on reassembly.',
    tools: [toolsCatalog.tweezers],
    screws: [],
    requires: ['front_panel'],
  },
}
