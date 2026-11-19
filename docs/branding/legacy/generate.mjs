/**
 * AULACBOT brand assets.
 *
 * Run from the repository root:
 *   bun docs/branding/generate.mjs
 *
 * The mark is a Lac bird, the water bird of the Dong Son bronze drums. Its open legs and raised
 * wing also draw the A of Au Lac, so the favicon reads as an A at 16 px. Nothing comes from
 * agentes.chat's blue square.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ico, png, render, resize } from "../../packages/ui/scripts/app-icons/raster.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "assets");

const C = {
  jade1: "#08251C",
  jade2: "#0B3226",
  bronze: "#8F5C2C",
  bronze2: "#B67A36",
  gold: "#E6B04A",
  gold2: "#F2C96B",
  cream: "#FAE9BF",
};

mkdirSync(OUT, { recursive: true });

const inside = (points, x, y) => {
  let hit = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};

function cubic(p0, c1, c2, p1, steps = 64) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const u = 1 - t;
    return [
      u ** 3 * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t ** 3 * p1[0],
      u ** 3 * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t ** 3 * p1[1],
    ];
  });
}

const poly = (points, color, extra = {}) => ({
  mask: (x, y) => inside(points, x, y),
  color: () => color,
  ...extra,
});

const disc = (cx, cy, r, color, extra = {}) => ({
  mask: (x, y) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r,
  color: () => color,
  ...extra,
});

const stroke = (points, width, color, extra = {}) => {
  const r = width / 2;
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const box = [Math.min(...xs) - r, Math.min(...ys) - r, Math.max(...xs) + r, Math.max(...ys) + r];
  return {
    mask: (x, y) => {
      if (x < box[0] || y < box[1] || x > box[2] || y > box[3]) return false;
      for (let i = 1; i < points.length; i++) {
        const [ax, ay] = points[i - 1];
        const [bx, by] = points[i];
        const dx = bx - ax;
        const dy = by - ay;
        const len = dx * dx + dy * dy;
        const t = len ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len)) : 0;
        if ((x - ax - t * dx) ** 2 + (y - ay - t * dy) ** 2 <= r * r) return true;
      }
      return false;
    },
    color: () => color,
    ...extra,
  };
};

function feather(base0, base1, tip, c0, c1, c2, c3, color) {
  const sideA = cubic(base0, c0, c1, tip);
  const sideB = cubic(tip, c2, c3, base1).slice(1);
  return poly([...sideA, ...sideB], color);
}

function bird(eye = "paint") {
  return [
    poly(
      [
        [500, 344],
        [572, 358],
        [414, 802],
        [310, 802],
      ],
      C.gold,
    ),
    poly(
      [
        [558, 364],
        [630, 338],
        [772, 802],
        [662, 802],
      ],
      C.gold,
    ),
    stroke(
      [
        [584, 370],
        [598, 330],
        [588, 298],
        [566, 278],
      ],
      116,
      C.gold,
    ),
    disc(552, 274, 84, C.gold),
    feather([620, 252], [622, 292], [850, 282], [700, 242], [786, 256], [790, 306], [704, 306], C.gold2),
    feather([530, 214], [498, 248], [366, 172], [490, 185], [420, 162], [395, 189], [462, 238], C.cream),
    feather([506, 230], [476, 260], [338, 236], [462, 196], [390, 214], [372, 266], [446, 286], C.gold2),
    feather([490, 256], [468, 282], [350, 286], [444, 226], [396, 264], [386, 304], [446, 302], C.gold),
    poly(
      [
        [330, 640],
        [452, 591],
        [636, 551],
        [700, 496],
        [684, 558],
        [778, 520],
        [750, 586],
        [862, 554],
        [810, 622],
        [728, 646],
        [566, 672],
        [430, 684],
        [354, 666],
      ],
      C.gold2,
    ),
    poly(
      [
        [374, 632],
        [470, 603],
        [632, 570],
        [650, 590],
        [470, 624],
        [384, 650],
      ],
      C.cream,
      { alpha: () => 0.62 },
    ),
    disc(572, 268, 16, C.jade1, eye === "cut" ? { erase: true } : {}),
  ];
}

function full(eye = "paint") {
  const layers = [
    { mask: () => true, color: () => C.jade1, bg: true },
    disc(512, 512, 454, C.jade2, { bg: true }),
    disc(512, 512, 440, C.jade1, { bg: true }),
    disc(512, 512, 402, C.jade2, { bg: true }),
    disc(512, 512, 386, C.jade1, { bg: true }),
  ];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + Math.PI / 16;
    layers.push(disc(512 + Math.cos(a) * 421, 512 + Math.sin(a) * 421, 6.5, C.bronze2, { bg: true }));
  }
  layers.push({
    mask: (x, y) => {
      const d = Math.hypot(x - 512, y - 512);
      return d >= 439 && d <= 445;
    },
    color: () => C.bronze,
    bg: true,
  });
  layers.push({
    mask: (x, y) => x >= 294 && x <= 730 && y >= 850 && y <= 864,
    color: () => C.bronze,
  });
  layers.push(...bird(eye));
  return layers;
}

function small() {
  const s = 1024 / 32;
  const p = (points) => points.map(([x, y]) => [x * s, y * s]);
  const layers = [{ mask: () => true, color: () => C.jade1, bg: true }];
  layers.push(
    poly(
      p([
        [7.1, 4.0],
        [10.2, 4.2],
        [6.2, 27.2],
        [2.4, 27.2],
      ]),
      C.gold,
    ),
    poly(
      p([
        [10.0, 4.2],
        [13.2, 3.3],
        [25.0, 27.2],
        [21.0, 27.2],
      ]),
      C.gold,
    ),
    poly(
      p([
        [1.2, 19.6],
        [7.1, 17.9],
        [19.7, 16.5],
        [23.1, 16.0],
        [20.8, 18.8],
        [4.0, 21.5],
      ]),
      C.gold2,
    ),
    poly(
      p([
        [9.0, 6.0],
        [6.2, 5.4],
        [3.8, 5.2],
        [4.4, 5.8],
        [6.4, 6.2],
        [9.4, 6.8],
      ]),
      C.gold,
    ),
    poly(
      p([
        [8.6, 5.0],
        [5.4, 3.2],
        [3.0, 2.6],
        [3.6, 3.2],
        [5.6, 4.2],
        [9.0, 6.2],
      ]),
      C.gold2,
    ),
    poly(
      p([
        [9.0, 4.4],
        [6.8, 2.4],
        [4.2, 1.0],
        [4.6, 1.6],
        [6.0, 2.9],
        [8.4, 5.2],
      ]),
      C.cream,
    ),
    disc(11.2 * s, 7.1 * s, 3.4 * s, C.gold),
    poly(
      p([
        [14.0, 6.2],
        [14.2, 8.4],
        [29.4, 8.1],
        [29.4, 7.1],
      ]),
      C.gold2,
    ),
    disc(12.2 * s, 6.9 * s, 1.05 * s, C.jade1),
  );
  return layers;
}

const master = render(1024, full());
writeFileSync(join(OUT, "aulacbot-mark-1024.png"), png(master, { opaque: true }));
const transparent = render(
  1024,
  full("cut").filter((layer) => !layer.bg),
);
writeFileSync(join(OUT, "aulacbot-mark-transparent-1024.png"), png(transparent));

for (const [name, color] of [
  ["ink", C.jade1],
  ["cream", C.cream],
]) {
  const stamp = full("cut")
    .filter((layer) => !layer.bg)
    .map((layer) => ({ ...layer, color: () => color, alpha: undefined }));
  writeFileSync(join(OUT, `aulacbot-stamp-${name}-1024.png`), png(render(1024, stamp)));
}

for (const n of [512, 256, 192, 180, 128, 64, 48, 32, 24, 16]) {
  const img = n <= 48 ? render(n, small(), { k: 1024 / n }) : resize(master, n);
  writeFileSync(join(OUT, `aulacbot-mark-${n}.png`), png(img, { opaque: true }));
}

writeFileSync(
  join(OUT, "favicon.ico"),
  ico(
    [16, 32, 48].map((n) => ({
      size: n,
      png: png(render(n, small(), { k: 1024 / n }), { opaque: true }),
    })),
  ),
);

console.log(`AULACBOT brand assets written to ${OUT}`);
