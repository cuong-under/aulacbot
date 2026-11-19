/**
 * The Cyber Lạc squad's pixel grids, shared by the web (SVG) and the phone (Skia/SVG). Every row is one pixel
 * line: `.` is empty, `o` the outline, the rest are the palette's own colors. Only data lives here so a native
 * screen can draw the same faces without taking the web's React DOM pieces with it.
 */
export const CYBER_LAC_COLORS: Record<string, string> = {
  ".": "none",
  o: "#04110d",
  "0": "#010605",
  j: "#0f6a59",
  d: "#0a3d33",
  m: "#2fd3b2",
  n: "#6af2d2",
  g: "#f2bf61",
  a: "#b0742c",
  w: "#ffffff",
  c: "#eafff9",
};

const GENERAL = [
  "................",
  "....o......o....",
  "...omo....omo...",
  "...oooooooooo...",
  "..oaaaaaaaaaao..",
  ".oaggggggggggao.",
  ".oaggggggggggao.",
  ".oag00000000gao.",
  ".oao0ww00ww0oao.",
  ".oao0ww00ww0oao.",
  ".oag00000000gao.",
  ".oaggggggggggao.",
  "..oaggggggggao..",
  "...ooagggaaoo...",
  "....oaaaaao.....",
  ".....o....o.....",
] as const;

const KING = [
  ".....g..g..g....",
  ".....gggggg.....",
  "...oooooooooo...",
  "..ojjjjjjjjjjo..",
  ".ojjjjjjjjjjjjo.",
  ".ojjnjjjjjjnjjo.",
  ".ojjjjjjjjjjjjo.",
  ".ojj00000000jjo.",
  ".ojo0ww00ww0ojo.",
  ".ojo0ww00ww0ojo.",
  ".ojj00000000jjo.",
  ".ojjjjjjjjjjjjo.",
  "..ojjjjjjjjjjo..",
  "...oojjjjjjoo...",
  "....oggggggo....",
  ".....o....o.....",
] as const;

const SAGE = [
  "................",
  "......oooo......",
  "....oojjjjoo....",
  "...ojjjjjjjjo...",
  "..ojjjjjjjjjjo..",
  ".oojjjjjjjjjjoo.",
  ".omjjjjjjjjjjmo.",
  ".oojjjjjjjjjjoo.",
  "..oj00000000jo..",
  "..oj0w0nn0w0jo..",
  "..oj0w0nn0w0jo..",
  "..oj00000000jo..",
  "...ojjjjjjjjo...",
  "....oojjjjoo....",
  ".....oggggo.....",
  "......o..o......",
] as const;

export const CYBER_LAC_SQUAD = [
  { label: "Lạc Tướng", rows: GENERAL },
  { label: "Lạc Vương", rows: KING },
  { label: "Lạc Thần", rows: SAGE },
] as const;

export type CyberLacIndex = 0 | 1 | 2;
export type CyberLacState = "idle" | "sleeping";

export interface CyberLacEyeLine {
  x: number;
  y: number;
  width: number;
}

/** The middle of each white eye, found in the grid: closed lids are drawn from it, never guessed per face. */
export function cyberLacEyeLines(rows: readonly string[]): CyberLacEyeLine[] {
  const seen = new Set<string>();
  const lines: CyberLacEyeLine[] = [];
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y] ?? "";
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== "w" || seen.has(`${x},${y}`)) continue;
      const cells: [number, number][] = [];
      const stack: [number, number][] = [[x, y]];
      seen.add(`${x},${y}`);
      while (stack.length > 0) {
        const [cx, cy] = stack.pop() as [number, number];
        cells.push([cx, cy]);
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (rows[ny]?.[nx] === "w" && !seen.has(`${nx},${ny}`)) {
            seen.add(`${nx},${ny}`);
            stack.push([nx, ny]);
          }
        }
      }
      const xs = cells.map(([cx]) => cx);
      const ys = cells.map(([, cy]) => cy);
      const left = Math.min(...xs);
      const right = Math.max(...xs);
      const top = Math.min(...ys);
      const bottom = Math.max(...ys);
      const width = Math.max(2, right - left + 1);
      lines.push({
        x: left + Math.floor((right - left + 1 - width) / 2),
        y: Math.round((top + bottom) / 2),
        width,
      });
    }
  }
  return lines;
}

export const CYBER_LAC_EYES = CYBER_LAC_SQUAD.map((member) => cyberLacEyeLines(member.rows));
