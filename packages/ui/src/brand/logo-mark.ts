export const CYBER_LAC_PIXEL_MARK = [
  "..4..66..4..",
  "..44.66.44..",
  "...446644...",
  "..33333333..",
  "..33333333..",
  ".3333333333.",
  ".3000000003.",
  ".300w00w003.",
  ".300w00w003.",
  ".3333333333.",
  "..33666633..",
  "....3663....",
] as const;

export const CYBER_LAC_PIXEL_COLORS = {
  "0": "#04110d",
  "1": "#0a3d33",
  "2": "#0f6a59",
  "3": "#2fd3b2",
  "4": "#6af2d2",
  "6": "#f2bf61",
  "7": "#b0742c",
  w: "#ffffff",
} as const;

export type CyberLacPixel = keyof typeof CYBER_LAC_PIXEL_COLORS;
