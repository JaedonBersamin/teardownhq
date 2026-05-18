import type { PartId } from '../data/deviceConfig'

/** Collect names from hit object up to the scene root */
export function collectNameChain(object: { name: string; parent: unknown }): string[] {
  const names: string[] = []
  let o: { name: string; parent: unknown } | null = object
  while (o) {
    if (o.name) names.push(o.name)
    o = (o.parent as { name: string; parent: unknown } | null) ?? null
  }
  return names
}

export function findPartGroupName(object: {
  name: string
  parent: unknown
}): string | null {
  let o: { name: string; parent: unknown } | null = object
  while (o) {
    if (o.name.startsWith('PART_')) return o.name
    o = (o.parent as { name: string; parent: unknown } | null) ?? null
  }
  return null
}

const SCREW_PART_GROUPS = new Set([
  'PART_ChassisScrews',
  'PART_FrontPanelScrews',
  'PART_PentalobeScrews',
  'PART_SpecialScrews',
])

function partGroupToPartId(group: string): PartId | null {
  if (SCREW_PART_GROUPS.has(group)) return null

  switch (group) {
    case 'PART_Battery':
      return 'battery'
    case 'PART_Display':
    case 'PART_FrontSensor':
    case 'PART_FrontCam':
    case 'PART_FrontCamBracket':
      return 'display'
    case 'PART_Cover':
    case 'PART_CoverFlexCables':
    case 'PART_MotherboardCover':
    case 'PART_MotherboardCablesCover':
    case 'PART_SimReaderCableCover':
      return 'connector_shield'
    default:
      break
  }

  const g = group.toLowerCase()
  if (g.includes('battery')) return 'battery'
  if (g.includes('display') || g.includes('frontpanel') || g.includes('front_sensor')) {
    return 'display'
  }
  if (g.includes('cover') && (g.includes('motherboard') || g.includes('flex') || g.includes('sim'))) {
    return 'connector_shield'
  }
  if (
    g.includes('backcover') ||
    g.includes('backplate') ||
    g.includes('frame') ||
    g.includes('motherboard') ||
    g.includes('innershell') ||
    g.includes('charging') ||
    g.includes('button') ||
    g.includes('speaker') ||
    g.includes('antenna') ||
    g.includes('cam') ||
    g.includes('port') ||
    g.includes('sim') ||
    g.includes('taptic') ||
    g.includes('mic') ||
    g.includes('magnet') ||
    g.includes('wireless') ||
    g.includes('grid') ||
    g.includes('flashlight') ||
    g.includes('adhesive')
  ) {
    return 'chassis'
  }

  return null
}

function isScrewName(blob: string): boolean {
  const b = blob.toLowerCase()
  if (/\bscrew\d/.test(b)) return true
  if (b.includes('_screw')) return true
  if (b.includes('front_panel_screw')) return true
  return false
}

/**
 * Map Blender PART_* groups (or legacy Sketchfab mesh names) to coarse PartIds.
 */
export function resolvePartIdFromNames(names: string[]): PartId | null {
  for (const raw of names) {
    if (raw.startsWith('PART_')) {
      const id = partGroupToPartId(raw)
      if (id) return id
    }
  }

  const blob = names.join('|').toLowerCase()
  if (isScrewName(blob)) return null
  if (blob.includes('battery')) return 'battery'
  if (
    blob.includes('front_panel') ||
    blob.includes('front_sensor') ||
    blob.includes('front_cam')
  ) {
    return 'display'
  }
  if (
    blob.includes('cover_flex') ||
    blob.includes('motherboard_cables_cover') ||
    blob.includes('motherboard_cover') ||
    blob.includes('simholder_cable_cover')
  ) {
    return 'connector_shield'
  }
  for (const raw of names) {
    const n = raw.toLowerCase()
    if (n === 'cover' || n.startsWith('cover_mat')) return 'connector_shield'
  }
  if (blob.includes('body') || blob.includes('back_cover') || blob.includes('inside_body')) {
    return 'chassis'
  }
  if (blob.includes('backplate')) return 'chassis'
  if (blob.includes('charging_port') || blob.includes('charging_cable')) return 'chassis'
  if (blob.includes('btn_')) return 'chassis'
  if (blob.includes('back_cam') || blob.includes('antenn')) return 'chassis'
  if (blob.includes('motherboard') && !blob.includes('cover')) return 'chassis'
  if (blob.includes('speaker') || blob.includes('earspeaker') || blob.includes('taptick')) {
    return 'chassis'
  }
  return null
}

export function resolvePartIdFromObject(object: {
  name: string
  parent: unknown
}): PartId | null {
  return resolvePartIdFromNames(collectNameChain(object))
}
