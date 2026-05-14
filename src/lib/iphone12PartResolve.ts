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

function isScrewName(blob: string): boolean {
  const b = blob.toLowerCase()
  if (/\bscrew\d/.test(b)) return true
  if (b.includes('_screw')) return true
  if (b.includes('front_panel_screw')) return true
  return false
}

/**
 * Map Sketchfab iPhone 12 teardown node names to coarse PartIds for the sandbox.
 * Unmapped clicks return null (ignored for selection).
 */
export function resolvePartIdFromNames(names: string[]): PartId | null {
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
