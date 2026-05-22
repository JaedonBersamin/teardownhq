import type { PartId } from '../data/deviceConfig'

// all named component nodes that exist in the GLB
const GLB_NODE_NAMES = new Set([
  'battery',
  'motherboard', 'motherboard_cover', 'motherboard_cables_cover',
  'front_panel', 'front_panel_screw01', 'front_panel_screw02', 'front_panel_screw03', 'front_panel_screw04',
  'back_cover', 'backplate', 'inside_body',
  'profile_housing_top', 'profile_housing_bottom', 'profile_housing_left', 'profile_housing_right', 'profile_housing_dummies',
  'wireless_charge', 'magnets',
  'back_cam', 'back_cam_cover', 'back_cam_glass', 'back_cam_hole1', 'back_cam_hole2', 'back_cam_flashlight_hole',
  'inside_cam_holder', 'flashlight', 'flashlight_dummy',
  'front_cam', 'front_cam_bracket', 'front_sensor',
  'earspeaker', 'speaker', 'speaker_cover', 'mic',
  'taptick',
  'btn_off', 'btn_off_gears', 'btn_volume_up', 'btn_volume_up_gears',
  'btn_volume_down', 'btn_volume_down_gears', 'btn_volume_off',
  'charging_port', 'charging_cable', 'inside_power_port',
  'simholder', 'simholder_box', 'simholder_cable_cover',
  'antenn', 'wifi_antenn',
  'cover', 'cover_flex_cables', 'grid_wires', 'glue_sticker',
  'screw_pentalobe',
  'Screw01', 'Screw02', 'Screw03', 'Screw04', 'Screw05',
  'Screw06', 'Screw08', 'Screw09', 'Screw10', 'Screw11',
  'Screw12', 'Screw13', 'Screw14', 'Screw15', 'Screw16',
  'Screw17', 'Screw18', 'Screw19', 'Screw20', 'Screw21',
  'Screw22', 'Screw23', 'Screw24', 'Screw25', 'Screw26',
  'Screw27', 'Screw28', 'Screw29', 'Screw30', 'Screw31',
  'Screw32', 'Screw33', 'Screw34', 'Screw35', 'Screw36',
  'Screw37', 'Screw38', 'Screw39', 'Screw40', 'Screw41',
  'Screw42', 'Screw43', 'Screw44', 'Screw045', 'Screw048',
  'Screw_special_01', 'Screw_special_02', 'Screws_special_003',
])

// walk up the parent chain and return the first node name that matches a known GLB component
export function findPartGroupName(object: { name: string; parent: unknown }): string | null {
  let o: { name: string; parent: unknown } | null = object
  while (o) {
    if (GLB_NODE_NAMES.has(o.name)) return o.name
    o = (o.parent as { name: string; parent: unknown } | null) ?? null
  }
  return null
}

// map GLB node names to PartIds — collapses individual screws and fixes the taptick typo
function nodeNameToPartId(name: string): PartId | null {
  // collapse all numbered chassis screws into one id
  if (/^Screw\d/.test(name)) return 'chassis_screws'
  if (name === 'Screw_special_01' || name === 'Screw_special_02' || name === 'Screws_special_003') return 'special_screws'

  // fix typo in GLB node name
  if (name === 'taptick') return 'taptic'

  return name as PartId
}


export function resolvePartIdFromObject(object: { name: string; parent: unknown }): PartId | null {
  const groupName = findPartGroupName(object)
  if (!groupName) return null
  return nodeNameToPartId(groupName)
}
