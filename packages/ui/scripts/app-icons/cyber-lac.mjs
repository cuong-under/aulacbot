/**
 * Cyber Lạc, the app icon the apps ship with: the Lạc bird as a machine that looks back at you. It is drawn here the
 * way the other icons are (ADR 0179): a shape on the 1024 scene, every fill dithered in the engine's cells, so the
 * mark sits in the same pixel world as the agent, the night and the moon.
 *
 * The bird is a head only, front on and with no neck: a wide mint head (the agent's own rounded block), a dark visor
 * with the two pill eyes, a gold crest of three fins and the bill in the middle. Jade sky, mint head, gold bill:
 * the palette in docs/branding/cyber-lac.
 */
import { toneAt } from "../../src/agent/engine.js";

const WHITE = "#ffffff";
const SKY_T = ["#010403", "#04110D", "#071F19", "#0B2C25", "#11453A", "#1E7A63"];
const MINT_T = ["#0A3D33", "#0F6A59", "#169B84", "#2FD3B2", "#6AF2D2"];
const GOLD_T = ["#5A3412", "#8A5320", "#C88734", "#F2BF61", "#FFE1A6"];
const GOLD_DEEP_T = ["#2E1A0A", "#4A2B10", "#7A4A1C", "#B0742C", "#E9B25A"];
const DEEP_T = ["#010403", "#020806", "#04110D", "#061A15", "#0A2A22"];

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const by = (x, y) => BAYER[(x & 3) + (y & 3) * 4];
const pick = (list, i) => list[Math.max(0, Math.min(list.length - 1, i))];

/* ---------- Shapes ---------- */

const CURVE = 24;
const cubic = ([x0, y0], [x1, y1], [x2, y2], [x3, y3]) =>
  Array.from({ length: CURVE + 1 }, (_, i) => {
    const t = i / CURVE;
    const u = 1 - t;
    return [
      u ** 3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x3,
      u ** 3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3,
    ];
  });
/** The inside of a closed outline. */
function polygon(points) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  return (X, Y) => {
    if (X < box[0] || Y < box[1] || X > box[2] || Y > box[3]) return false;
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [xi, yi] = points[i];
      const [xj, yj] = points[j];
      if (yi > Y !== yj > Y && X < ((xj - xi) * (Y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
}
function inRound(x, y, x0, y0, w, h, r) {
  if (x < x0 || y < y0 || x > x0 + w || y > y0 + h) return false;
  const cx = Math.min(Math.max(x, x0 + r), x0 + w - r);
  const cy = Math.min(Math.max(y, y0 + r), y0 + h - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

/**
 * The head in its own square (u, v in 0..1): a wide block with the agent's rounded top, the sides drawing in a little
 * and a flat chin, front on. No neck.
 */
const inHead = polygon([
  ...cubic([0.16, 0.1], [0.28, -0.03], [0.72, -0.03], [0.84, 0.1]),
  ...cubic([0.84, 0.1], [0.93, 0.24], [0.96, 0.44], [0.95, 0.64]),
  ...cubic([0.95, 0.64], [0.94, 0.84], [0.88, 0.96], [0.74, 1.0]),
  ...cubic([0.74, 1.0], [0.62, 1.03], [0.38, 1.03], [0.26, 1.0]),
  ...cubic([0.26, 1.0], [0.12, 0.96], [0.06, 0.84], [0.05, 0.64]),
  ...cubic([0.05, 0.64], [0.04, 0.44], [0.07, 0.24], [0.16, 0.1]),
]);

/* ---------- Layers on the 1024 scene ---------- */

const always = () => true;
const fill = (hex) => ({ bg: true, mask: always, color: () => hex });
function grid(cols, colorAt) {
  const c = 1024 / cols;
  return { bg: true, mask: always, color: (x, y) => colorAt(Math.floor(x / c), Math.floor(y / c), cols) };
}
function cells(cols, list) {
  const c = 1024 / cols;
  const at = new Map(list.map(([i, j, col]) => [i * 4096 + j, col]));
  const color = (x, y) => at.get(Math.floor(x / c) * 4096 + Math.floor(y / c));
  return { bg: true, mask: (x, y) => color(x, y) !== undefined, color };
}
/** A bird layer: `mask` filled with `tones` in cells of `cell` scene pixels, its gradient over `n` cells. */
function shaded(mask, tones, { x, y, cell, n }) {
  return {
    part: "agent",
    mask,
    color: (X, Y) => tones[toneAt(Math.floor((X - x) / cell), Math.floor((Y - y) / cell), n)],
  };
}
/** A layer shrunk by `k` around the scene's middle: the Android launcher's round mask must not cut the crest. */
function shrunk(layer, k) {
  const back = (X, Y) => [512 + (X - 512) / k, 512 + (Y - 512) / k];
  return {
    ...layer,
    mask: (X, Y) => {
      const [x, y] = back(X, Y);
      return layer.mask(x, y);
    },
    color: (X, Y) => {
      const [x, y] = back(X, Y);
      return layer.color(x, y);
    },
  };
}

/** The jade night around the bird: darker at the corners, a dither halo under the head. */
function skyAt(glow) {
  return (i, j, cols) => {
    const u = (i + 0.5) / cols;
    const v = (j + 0.5) / cols;
    let val = 0.12 + 0.26 * v;
    if (glow) val += 2.1 * Math.max(0, 1 - Math.hypot(u - 0.5, v - 0.56) / 0.64) ** 1.7;
    return pick(SKY_T, Math.floor(val + by(i, j)));
  };
}

/** Six sparks, clear of the head and the crest. */
const SPARKS = [
  [3, 5, "#1E7A63"],
  [28, 8, "#C88734"],
  [2, 19, "#2FD3B2"],
  [29, 22, "#8A5320"],
  [6, 29, "#6AF2D2"],
  [26, 30, "#F2BF61"],
];

/* The bird, front on: crest, head, visor, eyes, bill. */
const HEAD = { x: 224, y: 320, s: 576, cell: 32, n: 18 };
const headMask = (X, Y) => inHead((X - HEAD.x) / HEAD.s, (Y - HEAD.y) / HEAD.s);

const CREST_MID = [
  [512, 126],
  [562, 232],
  [512, 372],
  [462, 232],
];
const CREST_LEFT = [
  [456, 214],
  [300, 118],
  [352, 234],
  [448, 340],
];
const CREST_RIGHT = [
  [568, 214],
  [724, 118],
  [672, 234],
  [576, 340],
];

/** The dark visor band, the one piece that makes the head read as a machine. */
const visorMask = (X, Y) => inRound(X, Y, 336, 474, 352, 238, 66);
/** The engine's own eyes: two tall pills, mirrored around the middle. */
const eyesMask = (X, Y) => inRound(X, Y, 409, 506, 62, 166, 31) || inRound(X, Y, 553, 506, 62, 166, 31);

/**
 * The bill, front on: a shield hanging from the visor, wide at its root and pointed at the chin, split at the mouth.
 * Its root tucks under the visor's bottom edge, so the head has no gap between mask and bill.
 */
const BILL = [
  [470, 698],
  [554, 698],
  [602, 766],
  [550, 808],
  [512, 884],
  [474, 808],
  [422, 766],
];
const billMask = polygon(BILL);
const billTop = (X, Y) => billMask(X, Y) && Y < 776;
const billLow = (X, Y) => billMask(X, Y) && Y >= 776;
const billSeam = (X, Y) => billMask(X, Y) && Y >= 768 && Y < 782;

function bird() {
  return [
    shaded(polygon(CREST_LEFT), MINT_T, { x: 300, y: 118, cell: 24, n: 10 }),
    shaded(polygon(CREST_RIGHT), MINT_T, { x: 588, y: 118, cell: 24, n: 10 }),
    shaded(polygon(CREST_MID), GOLD_T, { x: 452, y: 126, cell: 24, n: 11 }),
    shaded(headMask, MINT_T, { x: HEAD.x, y: HEAD.y, cell: HEAD.cell, n: HEAD.n }),
    shaded(visorMask, DEEP_T, { x: 336, y: 474, cell: 32, n: 11 }),
    { part: "eyes", mask: eyesMask, color: () => WHITE },
    shaded(billTop, GOLD_T, { x: 422, y: 698, cell: 22, n: 10 }),
    shaded(billLow, GOLD_DEEP_T, { x: 422, y: 776, cell: 22, n: 6 }),
    { part: "agent", mask: billSeam, color: () => "#2E1A0A" },
  ];
}

/**
 * The same shapes, for callers that need the mark alone in scene coordinates (the desktop's tray icons, which are
 * template images: one silhouette, the eyes cut out). `box` is the mark's extent, crest top to chin.
 */
export const LAC_MARKS = {
  crest: [polygon(CREST_LEFT), polygon(CREST_RIGHT), polygon(CREST_MID)],
  head: headMask,
  visor: visorMask,
  bill: billMask,
  eyes: eyesMask,
  box: [300, 118, 724, 884],
};

/* ---------- Favicons, in pixels (the 1024 art blurs at 16 and 32) ---------- */

const tile = (N, r, color) => ({
  mask: (x, y) => inRound(x, y, 0, 0, N, N, r),
  color: () => color,
});
/** A scene mask read at a favicon's pixels: `k` scene units a pixel. */
const scaled = (k, mask) => (x, y) => mask((x + 0.5) * k, (y + 0.5) * k);
const flat = (mask, color) => ({ mask, color: () => color });

function favicon(N) {
  const k = 1024 / N;
  const at = (mask) => scaled(k, mask);
  // At 16 px the eyes are snapped to whole pixels; a pill there would only be grey.
  const eyes = N === 16 ? (x, y) => ((x >= 6 && x < 7) || (x >= 9 && x < 10)) && y >= 8 && y < 10 : at(eyesMask);
  return [
    tile(N, N * 0.22, "#04110D"),
    flat(at(polygon(CREST_LEFT)), "#2FD3B2"),
    flat(at(polygon(CREST_RIGHT)), "#2FD3B2"),
    flat(at(polygon(CREST_MID)), "#F2BF61"),
    flat(at(headMask), "#169B84"),
    flat(at(visorMask), "#020806"),
    flat(eyes, WHITE),
    flat(at(billTop), "#F2BF61"),
    flat(at(billLow), "#B0742C"),
  ];
}

/* ---------- The icon ---------- */

export const LAC = {
  light: () => [grid(32, skyAt(true)), cells(32, SPARKS), ...bird()],
  dark: () => [fill("#010403"), cells(32, SPARKS), ...bird()],
  /** The head 74% around the middle, so a round launcher mask keeps the crest and the bill. */
  android: () => [grid(32, skyAt(true)), cells(32, SPARKS), ...bird().map((layer) => shrunk(layer, 0.74))],
  favicon,
};
