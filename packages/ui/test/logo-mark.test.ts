import { expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { createElement } from "react";
// The command line's logo lives in the MIT setup package, which has no access to the browser's SVG: it keeps a copy.
import { LOGO_MARK, LOGO_WIDTH, logoLines, visible } from "../../setup/src/term";
import { LogoMark } from "../src/components/Logo";
import { CYBER_LAC_PIXEL_COLORS, CYBER_LAC_PIXEL_MARK } from "../src/brand/logo-mark";
import { setupDom } from "../testing/dom";

setupDom();

test("the command line, web and phone share the same 12×12 pixel mark", () => {
  expect(CYBER_LAC_PIXEL_MARK.join("\n")).toBe(LOGO_MARK.join("\n"));
  expect(CYBER_LAC_PIXEL_MARK).toHaveLength(12);
  for (const row of CYBER_LAC_PIXEL_MARK) expect(row).toHaveLength(12);
  for (const row of CYBER_LAC_PIXEL_MARK)
    for (const pixel of row) expect(pixel === "." || Object.hasOwn(CYBER_LAC_PIXEL_COLORS, pixel)).toBe(true);
});

test("the mark is symmetric, front on: the crest, the head, the visor and the bill all mirror", () => {
  const mirror = (row: string) => [...row].reverse().join("");
  expect(CYBER_LAC_PIXEL_MARK.map(mirror)).toEqual(CYBER_LAC_PIXEL_MARK as unknown as string[]);
});

test("the mark reads as the bird top to bottom: crest, head, visor with its two eyes, then the bill", () => {
  const rows = CYBER_LAC_PIXEL_MARK;
  const only = (chars: string, from: number, to: number) =>
    rows.slice(from, to).every((row) => [...row].every((p) => p === "." || chars.includes(p)));
  expect(only("46", 0, 3)).toBe(true); // the crest's three fins, mint tips and gold middle
  expect(only("36", 3, 5)).toBe(true); // the mint head under it
  expect(only("30w", 5, 9)).toBe(true); // the visor's band with the two eyes in it
  expect(only("36", 9, 12)).toBe(true); // the bill
  const eyes = rows.flatMap((row) => [...row].filter((p) => p === "w"));
  expect(eyes).toHaveLength(4); // two eyes of two pixels each, on the visor's middle band
});

test("the wordmark sits beside the mark and never runs past the logo's own width", () => {
  for (const depth of [24, 8, 4, 1] as const)
    for (const line of logoLines(depth)) expect(visible(line)).toBeLessThanOrEqual(LOGO_WIDTH);
});

test("every line has the mark's twelve columns, and the name is the product's, not upstream's", () => {
  const lines = logoLines(1);
  expect(lines).toHaveLength(6);
  for (const line of lines.slice(1, 5)) expect(line.length).toBeGreaterThanOrEqual(17);
  expect(lines[4]).toContain(".app");
  expect(lines.join("\n")).not.toContain("agentes");
});

test("the app's own mark uses crisp square cells on the same 12×12 grid", () => {
  const { container } = render(createElement(LogoMark));
  const svg = container.querySelector("svg");
  expect(svg?.getAttribute("viewBox")).toBe("0 0 12 12");
  expect(svg?.getAttribute("aria-hidden")).toBe("true");
  expect(svg?.getAttribute("shape-rendering")).toBe("crispEdges");
  expect(container.querySelectorAll("rect")).toHaveLength(CYBER_LAC_PIXEL_MARK.join("").replaceAll(".", "").length);
  expect(CYBER_LAC_PIXEL_MARK.flatMap((row) => [...row]).filter((pixel) => pixel === "w")).toHaveLength(4);
  expect(CYBER_LAC_PIXEL_COLORS["3"]).toBe("#2fd3b2");
});

test("a labelled app mark is an image with the product's name, so screen readers say it once", () => {
  const { container } = render(createElement(LogoMark, { label: "AULACBOT" }));
  const svg = container.querySelector("svg");
  expect(svg?.getAttribute("role")).toBe("img");
  expect(svg?.getAttribute("aria-label")).toBe("AULACBOT");
  expect(svg?.getAttribute("aria-hidden")).toBeNull();
});
