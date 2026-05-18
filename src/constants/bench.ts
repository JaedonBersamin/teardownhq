/** Mat top — phone is snapped so its lowest point sits here */
export const BENCH_MAT_SURFACE_Y = 0.01

/** Spin the phone on the mat after auto-align (charging port / heading) */
export const BENCH_PHONE_SPIN_Y = Math.PI

/** Rotate the whole work surface in the scene (mat runs along a different axis) */
export const BENCH_SCENE_ROTATION_Y = Math.PI / 2

/** Work surface */
export const BENCH_SURFACE_SIZE = 12
export const BENCH_SURFACE_COLOR = '#b8c4b0'
export const BENCH_SURFACE_Y = 0

/** Blender part groups used to find which way is “back” */
export const BENCH_BACK_PART_GROUPS = ['PART_BackCover', 'PART_Backplate'] as const
export const BENCH_DISPLAY_PART_GROUP = 'PART_Display'
