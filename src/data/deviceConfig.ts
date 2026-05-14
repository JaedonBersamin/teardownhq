export type PartId = 'chassis' | 'display' | 'battery' | 'connector_shield'

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
  /** Shown when “removal intent” is on — swap for real coords when you load a GLB */
  screws: ScrewDef[]
}

export const toolsCatalog: Record<string, ToolRef> = {
  p2: {
    id: 'p2',
    label: 'P2 Pentalobe driver',
  },
  ph000: {
    id: 'ph000',
    label: 'Phillips #000 screwdriver',
  },
  y000: {
    id: 'y000',
    label: 'Tri-point Y000 driver',
  },
  spudger: {
    id: 'spudger',
    label: 'Plastic spudger / opening pick',
  },
  suction: {
    id: 'suction',
    label: 'Suction cup (optional)',
  },
}

export const parts: Record<PartId, PartConfig> = {
  chassis: {
    id: 'chassis',
    title: 'Frame & housing',
    description:
      'Back glass, frame, buttons, rear camera housing, ports, and other structural parts on this Sketchfab iPhone 12 teardown (mapped from mesh names).',
    tools: [toolsCatalog.spudger, toolsCatalog.p2],
    screws: [],
  },
  display: {
    id: 'display',
    title: 'Front / display stack',
    description:
      'Front panel, glass, earpiece area, and front camera cluster as grouped in the GLB. Fine-grain separation comes later.',
    tools: [toolsCatalog.p2, toolsCatalog.suction, toolsCatalog.spudger],
    screws: [
      { id: 'display-p2-a', typeLabel: 'P2 Pentalobe (example)', position: [0, 0, 0] },
      { id: 'display-p2-b', typeLabel: 'P2 Pentalobe (example)', position: [0, 0, 0] },
    ],
  },
  battery: {
    id: 'battery',
    title: 'Battery',
    description: 'Lithium-ion pack and adhesive region — always disconnect power before prying nearby flexes in real life.',
    tools: [toolsCatalog.ph000, toolsCatalog.spudger],
    screws: [
      { id: 'battery-ph-1', typeLabel: 'Phillips #000 (example)', position: [0, 0, 0] },
      { id: 'battery-ph-2', typeLabel: 'Phillips #000 (example)', position: [0, 0, 0] },
    ],
  },
  connector_shield: {
    id: 'connector_shield',
    title: 'Covers & shields',
    description:
      'Internal metal covers over flexes and connectors (motherboard cover, flex cover, SIM bracket cover, etc.) as grouped from node names.',
    tools: [toolsCatalog.y000, toolsCatalog.ph000],
    screws: [
      { id: 'shield-y000', typeLabel: 'Tri-point Y000 (example)', position: [0, 0, 0] },
    ],
  },
}
