/**
 * Cyber Lạc brand assets for AULACBOT.
 *
 * Run from the repository root:
 *   bun docs/branding/cyber-lac/generate.mjs
 *
 * The vectors live in source/; Chromium (Brave) rasterises them at exact pixel sizes so every
 * PNG is drawn from the same paths. Nothing here is copied from agentes.chat's blue mark.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ico } from "../../../packages/ui/scripts/app-icons/raster.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "assets");
const BUILD = join(HERE, "build");
const PAGES = join(BUILD, "pages");
/**
 * A Chromium that can screenshot a page without a window. Set CHROME_HEADLESS to pick one; otherwise this looks in
 * Playwright's cache, then at Chrome, Edge and Brave's usual Windows paths.
 */
function findChrome() {
  const candidates = [];
  if (process.env.CHROME_HEADLESS) candidates.push(process.env.CHROME_HEADLESS);
  const local = process.env.LOCALAPPDATA;
  if (local) {
    const cache = join(local, "ms-playwright");
    if (existsSync(cache)) {
      for (const dir of readdirSync(cache).filter((name) => name.startsWith("chromium_headless_shell-"))) {
        candidates.push(join(cache, dir, "chrome-headless-shell-win64", "chrome-headless-shell.exe"));
      }
    }
  }
  for (const base of [process.env.ProgramFiles, process.env["ProgramFiles(x86)"]]) {
    if (!base) continue;
    candidates.push(join(base, "Google/Chrome/Application/chrome.exe"));
    candidates.push(join(base, "Microsoft/Edge/Application/msedge.exe"));
    candidates.push(join(base, "BraveSoftware/Brave-Browser/Application/brave.exe"));
  }
  const found = candidates.find((path) => path && existsSync(path));
  if (!found) throw new Error("No Chromium found for screenshots; set CHROME_HEADLESS to chrome-headless-shell.exe.");
  return found;
}

const CHROME = findChrome();

mkdirSync(join(OUT, "desktop", "tray"), { recursive: true });
mkdirSync(join(OUT, "email"), { recursive: true });
mkdirSync(PAGES, { recursive: true });

const source = (name) => readFileSync(join(HERE, "source", name), "utf8");
const font = readFileSync(join(HERE, "../../..", "packages/engine/assets/fonts/Onest-Bold.ttf")).toString("base64");

const C = {
  jade: "#04110D",
  jade2: "#0C2C25",
  jade3: "#061712",
  mint: "#6AF2D2",
  mint2: "#8DF8DD",
  gold: "#F2BF61",
  gold2: "#FFF0C9",
  cream: "#EAFFF9",
  ink: "#10251D",
  paper: "#F5EEDC",
  bronze: "#8F5C2C",
  bone: "#EFEFEC",
  muted: "#8FA69A",
};

const tile = source("cyber-lac-tile.svg");
const tileBig = source("cyber-lac-tile-big.svg");
const tileSquare = source("cyber-lac-tile-square.svg");
const mark = source("cyber-lac-mark.svg");
const glyph = source("cyber-lac-glyph.svg");
const glyph16 = source("cyber-lac-glyph-16.svg");
const glyphMono = source("cyber-lac-glyph-mono.svg");

/** The square tile's own gradient, pushed darker for iOS 18's dark icon. */
const darker = {
  "#0C2C25": "#061712",
  "#061712": "#030C09",
  "#030C09": "#010403",
  "#010504": "#000201",
};
const tileDark = tileSquare.replace(/#0C2C25|#061712|#030C09|#010504/g, (hex) => darker[hex]);

/** The tile's sky without the bird: Android's adaptive background layer. */
const tileBack = tileSquare.replace(
  /<g transform="translate\(-254 -178\) scale\(1\.34\)">[\s\S]*?<\/g>\s*(?=<rect x="1\.5")/,
  "",
);

const fontFace = `@font-face{font-family:Onest;font-weight:700;src:url(data:font/ttf;base64,${font}) format("truetype")}`;

function page(body, css = "") {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:transparent}
*{box-sizing:border-box}
${fontFace}
${css}
</style></head><body>${body}</body></html>`;
}

function shot(name, width, height, html, { transparent = true } = {}) {
  const htmlFile = join(PAGES, `${name}.html`);
  const pngFile = join(OUT, `${name}.png`);
  mkdirSync(dirname(htmlFile), { recursive: true });
  mkdirSync(dirname(pngFile), { recursive: true });
  writeFileSync(htmlFile, html);
  const url = `file:///${htmlFile.replace(/\\/g, "/")}`;
  execFileSync(
    CHROME,
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "--allow-file-access-from-files",
      "--force-device-scale-factor=1",
      `--window-size=${width},${height}`,
      `--default-background-color=${transparent ? "00000000" : "FFFFFFFF"}`,
      `--screenshot=${pngFile}`,
      url,
    ],
    { stdio: "ignore", timeout: 60_000 },
  );
  console.log(`${pngFile.replace(HERE + "\\", "")} ${width}x${height}`);
}

/** An SVG stretched to the page, optionally inside a padded stage. */
function svgShot(name, svg, width, height, { padding = 0, extraCss = "", transparent = true, bg = null } = {}) {
  const background = bg ? `background:${bg};` : "";
  const html = page(
    `<div class="stage">${svg}</div>`,
    `.stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:${padding}%;${background}}
     .stage>svg{display:block;width:100%;height:100%}
     ${extraCss}`,
  );
  shot(name, width, height, html, { transparent });
}

function htmlShot(name, body, css, width, height, { transparent = true } = {}) {
  shot(name, width, height, page(body, css), { transparent });
}

const wordmark = (color, size = 160, tracking = ".055em") =>
  `<div style="font-family:Onest;font-weight:700;font-size:${size}px;line-height:1;letter-spacing:${tracking};color:${color};white-space:nowrap;padding-right:${tracking}">AULACBOT</div>`;

/* ------------------------------------------------------------------------------------------------
 * App icon sizes
 * ---------------------------------------------------------------------------------------------- */

svgShot("cyber-lac-mark-1024", tileSquare, 1024, 1024, { transparent: false });
for (const size of [512, 256, 192, 180, 128, 64]) {
  svgShot(`cyber-lac-mark-${size}`, tileSquare, size, size, { transparent: false });
}
for (const size of [48, 32, 24]) {
  svgShot(`cyber-lac-mark-${size}`, glyph, size, size);
}
svgShot("cyber-lac-mark-16", glyph16, 16, 16);

/* The bird alone, for a light surface and for the splash. */
svgShot("cyber-lac-mark-transparent-1024", mark, 1024, 1024);

/* iOS 18's light, dark and tinted 1024s. */
svgShot("cyber-lac-ios-1024", tileSquare, 1024, 1024, { transparent: false });
svgShot("cyber-lac-ios-dark-1024", tileDark, 1024, 1024, { transparent: false });
svgShot("cyber-lac-ios-tinted-1024", tileDark, 1024, 1024, {
  transparent: false,
  extraCss: ".stage>svg{filter:grayscale(1) contrast(1.06)}",
});

/* Android's adaptive layers: the sky, the bird inside the 72/108 safe circle, and one colour. */
svgShot("cyber-lac-android-background-1024", tileBack, 1024, 1024, {
  transparent: false,
  bg: C.jade,
});
svgShot("cyber-lac-android-foreground-1024", mark, 1024, 1024, { padding: 16.65 });
svgShot("cyber-lac-android-monochrome-1024", glyphMono, 1024, 1024, {
  padding: 16.65,
  extraCss: ".stage>svg{color:#000}",
});

/* A maskable PWA icon keeps the art inside the central 80%. */
svgShot("cyber-lac-maskable-512", tileSquare, 512, 512, {
  padding: 10,
  transparent: false,
  bg: C.jade,
});

/* ------------------------------------------------------------------------------------------------
 * Favicons and the one-colour stamps
 * ---------------------------------------------------------------------------------------------- */

svgShot("favicon-16", glyph16, 16, 16);
svgShot("favicon-32", glyph, 32, 32);
svgShot("favicon-48", glyph, 48, 48);
writeFileSync(
  join(OUT, "favicon.ico"),
  ico(
    [16, 32, 48].map((size) => ({
      size,
      png: readFileSync(join(OUT, `favicon-${size}.png`)),
    })),
  ),
);
writeFileSync(
  join(OUT, "favicon.svg"),
  glyph.replace("<title>Cyber Lac - small glyph</title>", "<title>AULACBOT</title>"),
);

svgShot("cyber-lac-stamp-ink-1024", glyphMono, 1024, 1024, {
  extraCss: `.stage>svg{color:${C.ink}}`,
});
svgShot("cyber-lac-stamp-cream-1024", glyphMono, 1024, 1024, {
  extraCss: `.stage>svg{color:${C.cream}}`,
});

/* ------------------------------------------------------------------------------------------------
 * Social card
 * ---------------------------------------------------------------------------------------------- */

htmlShot(
  "cyber-lac-og-1200x630",
  `<div class="card">
    <div class="copy">
      <div class="kicker">AULAC.APP&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      <div class="name">AULACBOT</div>
      <div class="display">ÂU LẠC BOT</div>
      <div class="tag">Trợ lý AI cá nhân<br/>Không gian AI cho nhóm</div>
      <div class="rule"></div>
      <div class="domain">AULAC.APP</div>
    </div>
    <div class="art">
      <div class="halo"></div>
      <div class="tile">${tileBig}</div>
    </div>
  </div>`,
  `body{background:${C.jade}}
   .card{position:absolute;inset:0;background:
     radial-gradient(720px 520px at 78% 42%, rgba(69,255,212,.14), transparent 65%),
     radial-gradient(900px 700px at 52% 115%, rgba(242,191,97,.09), transparent 68%),
     linear-gradient(135deg,#0C2C25 0%,#04110D 48%,#010403 100%);
     overflow:hidden}
   .card:after{content:"";position:absolute;inset:0;background-image:
     linear-gradient(rgba(167,243,221,.05) 1px,transparent 1px),
     linear-gradient(90deg,rgba(167,243,221,.05) 1px,transparent 1px);
     background-size:64px 64px}
   .copy{position:absolute;left:84px;top:92px;z-index:2}
   .kicker{font-family:Onest;font-weight:700;font-size:15px;letter-spacing:.32em;color:${C.gold}}
   .name{font-family:Onest;font-weight:700;font-size:92px;line-height:.98;letter-spacing:.045em;color:${C.cream};margin-top:30px}
   .display{font-family:Onest;font-weight:700;font-size:24px;letter-spacing:.3em;color:${C.gold};margin-top:18px}
   .tag{font-family:Onest;font-weight:400;font-size:30px;line-height:1.42;color:#B9CDC4;margin-top:42px}
   .rule{width:430px;height:2px;background:linear-gradient(90deg,${C.bronze},rgba(143,92,44,0));margin-top:40px}
   .domain{font-family:Onest;font-weight:700;font-size:24px;letter-spacing:.24em;color:${C.gold};margin-top:36px}
   .art{position:absolute;right:52px;top:56px;width:540px;height:540px;display:flex;align-items:center;justify-content:center}
   .halo{position:absolute;width:510px;height:510px;border-radius:50%;border:2px solid rgba(242,201,107,.16);
     box-shadow:0 0 120px rgba(69,255,212,.16) inset,0 0 90px rgba(69,255,212,.12)}
   .tile{width:410px;height:410px;filter:drop-shadow(0 26px 60px rgba(0,0,0,.55))}
   .tile>svg{display:block;width:100%;height:100%}`,
  1200,
  630,
  { transparent: false },
);

/* ------------------------------------------------------------------------------------------------
 * Wordmarks and lockups
 * ---------------------------------------------------------------------------------------------- */

htmlShot(
  "cyber-lac-wordmark-cream",
  `<div class="wrap">${wordmark(C.cream, 160)}</div>`,
  `.wrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}`,
  1600,
  260,
);
htmlShot(
  "cyber-lac-wordmark-jade",
  `<div class="wrap">${wordmark(C.ink, 160)}</div>`,
  `.wrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}`,
  1600,
  260,
);

for (const [name, color, sub, surface] of [
  ["cyber-lac-logo-dark", C.cream, C.gold, "dark"],
  ["cyber-lac-logo-light", C.ink, C.bronze, "light"],
]) {
  htmlShot(
    name,
    `<div class="lock">
      <div class="tile">${tileBig}</div>
      <div class="type">
        ${wordmark(color, 132)}
        <div class="sub">ÂU LẠC BOT&nbsp;&nbsp;/&nbsp;&nbsp;AULAC.APP</div>
      </div>
    </div>`,
    `.lock{position:absolute;inset:0;display:flex;align-items:center;gap:54px;padding:0 64px}
     .tile{width:340px;height:340px;flex:0 0 auto}
     .tile>svg{display:block;width:100%;height:100%}
     .type{display:flex;flex-direction:column;gap:20px}
     .sub{font-family:Onest;font-weight:400;font-size:27px;letter-spacing:.19em;color:${sub}}
     ${surface === "light" ? "" : ""}`,
    1900,
    520,
  );
}

/* Email's 173×36 slot, drawn at 2x. */
for (const [name, wordColor, wrap] of [
  ["logo-ink", C.ink, "plain"],
  ["logo-bone", C.bone, "plain"],
  ["logo-ink-tile", C.ink, "tile"],
]) {
  htmlShot(
    `email/${name}`,
    `<div class="letter ${wrap === "tile" ? "letter--tile" : ""}">
      <div class="tile">${tileBig}</div>
      <div class="word" style="color:${wordColor}">AULACBOT</div>
    </div>`,
    `.letter{position:absolute;inset:0;display:flex;align-items:center;gap:14px;padding:4px 10px}
     .letter--tile{background:#fff;border-radius:14px}
     .tile{width:60px;height:60px;flex:0 0 auto}
     .tile>svg{display:block;width:100%;height:100%}
     .word{font-family:Onest;font-weight:700;font-size:31px;letter-spacing:.055em;white-space:nowrap;line-height:1;padding-right:.055em}`,
    346,
    72,
  );
}

/* The service worker and the address-bar mark. */
svgShot("email/mark", tileSquare, 104, 104, { transparent: false });

/* ------------------------------------------------------------------------------------------------
 * Splash and notification pictures
 * ---------------------------------------------------------------------------------------------- */

svgShot("cyber-lac-splash-512", tileBig, 512, 512, { padding: 10 });
svgShot("cyber-lac-notification-96", glyphMono, 96, 96, {
  padding: 8,
  extraCss: ".stage>svg{color:#fff}",
});

/* The names a web root expects, as copies of the rendered masters. */
const alias = (from, to) => writeFileSync(join(OUT, to), readFileSync(join(OUT, from)));
alias("cyber-lac-mark-180.png", "apple-touch-icon.png");
alias("cyber-lac-mark-192.png", "icon-192.png");
alias("cyber-lac-mark-512.png", "icon-512.png");
alias("cyber-lac-maskable-512.png", "icon-maskable-512.png");
alias("cyber-lac-og-1200x630.png", "og.png");
alias("cyber-lac-splash-512.png", "splash-icon.png");
alias("cyber-lac-notification-96.png", "notification-icon.png");

/* ------------------------------------------------------------------------------------------------
 * Desktop: a macOS-grid master, a Dock picture, a window picture and the seven tray templates
 * ---------------------------------------------------------------------------------------------- */

svgShot("desktop/app-icon-1024", tileBig, 1024, 1024, {
  padding: 8.5,
  extraCss: ".stage{padding:8.5%;filter:drop-shadow(0 20px 34px rgba(0,0,0,.42))}",
});
svgShot("desktop/app-icon-512", tileBig, 512, 512, {
  extraCss: ".stage{padding:8.5%;filter:drop-shadow(0 10px 17px rgba(0,0,0,.42))}",
});
svgShot("desktop/app-icon-256", tileBig, 256, 256, {
  extraCss: ".stage{padding:8.5%;filter:drop-shadow(0 5px 9px rgba(0,0,0,.42))}",
});

for (const size of [16, 24, 32, 48, 64, 128, 256]) {
  svgShot(`desktop/icon-${size}`, size <= 48 ? glyph : tileSquare, size, size, {
    transparent: false,
  });
}
writeFileSync(
  join(OUT, "desktop", "icon.ico"),
  ico(
    [16, 24, 32, 48, 64, 128, 256].map((size) => ({
      size,
      png: readFileSync(join(OUT, "desktop", `icon-${size}.png`)),
    })),
  ),
);

/* Tray templates are alpha-only: a black glyph, with badges cut transparent. */
const trayBadge = (state) => {
  if (state === "update") {
    return `<mask id="badgeMask" maskUnits="userSpaceOnUse"><rect width="36" height="36" fill="#fff"/>
      <path d="M28 24.6v6.2M25.3 27.4 28 30.2l2.7-2.8" fill="none" stroke="#000" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    </mask><g mask="url(#badgeMask)"><circle cx="28" cy="28" r="6.3" fill="#000"/></g>`;
  }
  if (state === "browsing") {
    return `<mask id="badgeMask" maskUnits="userSpaceOnUse"><rect width="36" height="36" fill="#fff"/>
      <circle cx="28" cy="28" r="2.7" fill="#000"/>
    </mask><g mask="url(#badgeMask)"><circle cx="28" cy="28" r="6.3" fill="#000"/></g>`;
  }
  if (state === "needs") {
    return `<mask id="badgeMask" maskUnits="userSpaceOnUse"><rect width="36" height="36" fill="#fff"/>
      <rect x="27.2" y="24.3" width="1.6" height="4.4" rx=".8" fill="#000"/>
      <circle cx="28" cy="30.6" r=".95" fill="#000"/>
    </mask><g mask="url(#badgeMask)"><circle cx="28" cy="28" r="6.3" fill="#000"/></g>`;
  }
  if (state === "paused") {
    return `<mask id="badgeMask" maskUnits="userSpaceOnUse"><rect width="36" height="36" fill="#fff"/>
      <rect x="25.7" y="24.7" width="1.7" height="6.6" rx=".7" fill="#000"/>
      <rect x="28.9" y="24.7" width="1.7" height="6.6" rx=".7" fill="#000"/>
    </mask><g mask="url(#badgeMask)"><circle cx="28" cy="28" r="6.3" fill="#000"/></g>`;
  }
  if (state === "working") {
    return `<mask id="badgeMask" maskUnits="userSpaceOnUse"><rect width="36" height="36" fill="#fff"/>
      <path d="M26.4 24.6 31 28l-4.6 3.4Z" fill="#000"/>
    </mask><g mask="url(#badgeMask)"><circle cx="28" cy="28" r="6.3" fill="#000"/></g>`;
  }
  return "";
};

for (const state of ["idle", "working", "paused", "offline", "update", "browsing", "needs"]) {
  const outline = state === "offline";
  const silhouette = glyphMono
    .replace(/^[\s\S]*?<g fill="currentColor" mask="url\(#cut\)">/, "")
    .replace(/<\/g>\s*<\/svg>\s*$/, "");
  const body = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
    <defs>
      <mask id="gap" maskUnits="userSpaceOnUse"><rect width="36" height="36" fill="#fff"/><circle cx="28" cy="28" r="8.6" fill="#000"/></mask>
      <mask id="cut" maskUnits="userSpaceOnUse"><rect width="32" height="32" fill="#fff"/>
        <circle cx="14.8" cy="13.2" r="2.4" fill="#000"/>
        <path d="M10.4 11.0 L18.4 11.6 L19.0 15.4 L10.8 15.0 Z" fill="#000"/>
      </mask>
    </defs>
    <g mask="url(#gap)" transform="translate(4 4) scale(.875)">
      <g ${outline ? 'style="fill:none;stroke:#000;stroke-width:2.1" mask="url(#cut)"' : 'style="fill:#000" mask="url(#cut)"'}>
        ${silhouette}
      </g>
    </g>
    ${trayBadge(state)}
  </svg>`;
  svgShot(`desktop/tray/${state}`, body, 36, 36);
}

/* ------------------------------------------------------------------------------------------------
 * Web manifest
 * ---------------------------------------------------------------------------------------------- */

writeFileSync(
  join(OUT, "site.webmanifest"),
  JSON.stringify(
    {
      name: "AULACBOT",
      short_name: "AULACBOT",
      description: "Personal AI Assistant & Team AI Workspace",
      start_url: "/",
      display: "standalone",
      background_color: C.jade,
      theme_color: C.jade,
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    null,
    2,
  ) + "\n",
);

/* Copies the editable vectors beside the rendered files. */
writeFileSync(join(OUT, "cyber-lac-mark.svg"), tileSquare);
writeFileSync(join(OUT, "cyber-lac-mark-transparent.svg"), mark);
writeFileSync(join(OUT, "cyber-lac-tile.svg"), tile);
writeFileSync(join(OUT, "cyber-lac-tile-big.svg"), tileBig);
writeFileSync(join(OUT, "cyber-lac-glyph.svg"), glyph);
writeFileSync(join(OUT, "cyber-lac-glyph-mono.svg"), glyphMono);

/* ------------------------------------------------------------------------------------------------
 * Brand board
 * ---------------------------------------------------------------------------------------------- */

const swatch = (name, hex) =>
  `<div class="sw"><div class="chip" style="background:${hex}"></div><div class="sn">${name}</div><div class="sh">${hex}</div></div>`;
const sizeImg = (size) =>
  `<img src="data:image/png;base64,${readFileSync(join(OUT, `cyber-lac-mark-${size}.png`)).toString("base64")}" style="width:${size}px;height:${size}px"/>`;

htmlShot(
  "cyber-lac-brand-board",
  `<div class="board">
    <div class="left">
      <div class="tile">${tileBig}</div>
      <div class="wm">AULACBOT</div>
      <div class="display">ÂU LẠC BOT</div>
      <div class="rule"></div>
      <div class="tag">Trợ lý AI cá nhân<br/>Không gian AI cho nhóm</div>
      <div class="domain">AULAC.APP</div>
    </div>
    <div class="right">
      <div class="kicker">HEAD MARK / 02 · FINAL</div>
      <div class="title">Cyber Lạc</div>
      <div class="sub">LẠC BIRD · MÁY TÍNH · 2026</div>
      <div class="body">Đầu Lạc cách điệu thành phiến kim loại: mỏ dài, mào ba vây,<br/>mắt camera. Đọc được ở 16 px, vẫn là một nhân vật ở 1024 px.<br/>Kế thừa chim Lạc Đông Sơn, không dùng lại logo agentes.chat.</div>
      <div class="label">PALETTE</div>
      <div class="sws">${swatch("JADE", C.jade)}${swatch("MINT", C.mint)}${swatch("GOLD", C.gold)}${swatch("CREAM", C.cream)}</div>
      <div class="label">SIZES</div>
      <div class="sizes">
        <div class="sz">${sizeImg(16)}<b>16</b></div>
        <div class="sz">${sizeImg(24)}<b>24</b></div>
        <div class="sz">${sizeImg(32)}<b>32</b></div>
        <div class="sz">${sizeImg(48)}<b>48</b></div>
        <div class="sz">${sizeImg(64)}<b>64</b></div>
        <div class="sz">${sizeImg(128)}<b>128</b></div>
      </div>
      <div class="label">LOCKUP</div>
      <div class="lockline">${wordmark(C.ink, 62)}</div>
    </div>
    <div class="foot">AULACBOT / AULAC.APP / 2026</div>
    <div class="foot rightf">Original fork identity · upstream attribution stays visible</div>
  </div>`,
  `body{background:${C.paper}}
   .board{position:absolute;inset:0;background:${C.paper};overflow:hidden}
   .board:after{content:"";position:absolute;inset:0;pointer-events:none;
     background-image:radial-gradient(rgba(16,37,29,.06) 1px,transparent 1px);background-size:6px 6px}
   .left{position:absolute;left:60px;top:60px;width:720px;height:880px;border-radius:46px;background:${C.jade};
     background-image:radial-gradient(520px 420px at 50% 22%,rgba(69,255,212,.16),transparent 68%),
     radial-gradient(420px 360px at 10% 100%,rgba(242,191,97,.10),transparent 70%);
     display:flex;flex-direction:column;align-items:center;overflow:hidden}
   .left:before{content:"";position:absolute;left:160px;top:116px;width:400px;height:400px;border:2px solid rgba(242,201,107,.17);border-radius:50%}
   .tile{width:352px;height:352px;margin-top:140px;filter:drop-shadow(0 24px 40px rgba(0,0,0,.45))}
   .tile>svg{display:block;width:100%;height:100%}
   .wm{font-family:Onest;font-weight:700;font-size:52px;letter-spacing:.09em;color:${C.cream};margin-top:18px}
   .display{font-family:Onest;font-weight:700;font-size:18px;letter-spacing:.34em;color:${C.gold};margin-top:16px}
   .rule{width:170px;height:1px;background:${C.bronze};margin:26px 0 20px}
   .tag{font-family:Onest;font-weight:400;font-size:19px;line-height:1.55;color:#B9CDC4;text-align:center}
   .domain{font-family:Onest;font-weight:700;font-size:20px;letter-spacing:.24em;color:${C.gold};margin-top:118px}
   .right{position:absolute;left:840px;top:86px;width:700px}
   .kicker{font-family:Onest;font-weight:700;font-size:12px;letter-spacing:.26em;color:${C.bronze}}
   .title{font-family:Onest;font-weight:700;font-size:58px;letter-spacing:-.01em;color:${C.ink};margin-top:16px}
   .sub{font-family:Onest;font-weight:700;font-size:13px;letter-spacing:.22em;color:${C.bronze};margin-top:14px}
   .body{font-family:Onest;font-weight:400;font-size:19px;line-height:1.58;color:${C.ink};margin-top:26px}
   .label{font-family:Onest;font-weight:700;font-size:11px;letter-spacing:.24em;color:#5B6C63;margin-top:44px}
   .sws{display:flex;gap:20px;margin-top:14px}
   .sw{width:150px}
   .chip{width:150px;height:92px;border-radius:10px;border:1px solid rgba(16,37,29,.12)}
   .sn{font-family:Onest;font-weight:700;font-size:11px;letter-spacing:.1em;color:${C.ink};margin-top:9px}
   .sh{font-family:Onest;font-weight:400;font-size:11px;color:#5B6C63;margin-top:2px}
   .sizes{display:flex;align-items:flex-end;gap:34px;margin-top:18px;height:140px}
   .sz{display:flex;flex-direction:column;align-items:center;gap:9px}
   .sz img{display:block;image-rendering:auto}
   .sz b{font-family:Onest;font-weight:700;font-size:11px;color:#5B6C63}
   .sz:nth-child(1) img{width:16px;height:16px}
   .sz:nth-child(2) img{width:24px;height:24px}
   .sz:nth-child(3) img{width:32px;height:32px}
   .sz:nth-child(4) img{width:48px;height:48px}
   .sz:nth-child(5) img{width:64px;height:64px}
   .sz:nth-child(6) img{width:128px;height:128px}
   .lockline{margin-top:16px}
   .foot{position:absolute;left:60px;bottom:34px;font-family:Onest;font-weight:400;font-size:13px;color:#5B6C63}
   .rightf{left:auto;right:60px;text-align:right}`,
  1600,
  1000,
  { transparent: false },
);

console.log("Cyber Lạc assets written to", OUT);
