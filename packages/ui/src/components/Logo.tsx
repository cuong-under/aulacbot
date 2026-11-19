import type { CSSProperties } from "react";
import { cx } from "../cx";
import { CYBER_LAC_PIXEL_MARK } from "../brand/logo-mark";

/** The wordmark and the domain in the expanded logo: brand names, never translated. */
const NAME = "AULACBOT";
const TLD = ".app";

/**
 * The workspace's 12 × 12 Cyber Lạc pixel mark, shared with the terminal logo. Mono uses the same pixel grid and
 * cuts the bird out of the tile.
 */
export function LogoMark({ size, className, label }: { size?: number; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      className={cx("ac-logo__mark", className)}
      style={size ? { width: size, height: size } : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {CYBER_LAC_PIXEL_MARK.flatMap((row, y) =>
        [...row].map((pixel, x) => {
          if (pixel === ".") return null;
          const className = pixel === "w" ? "ac-logo__eyes" : pixel === "0" ? "ac-logo__visor" : `ac-logo__tone-${pixel}`;
          return <rect key={`${x}-${y}`} className={className} x={x} y={y} width="1" height="1" />;
        }),
      )}
    </svg>
  );
}

export interface LogoProps {
  /** `main` (app) or `expanded` (+ ".app", where the domain matters). */
  variant?: "main" | "expanded";
  /** One-color version. */
  mono?: boolean;
  /** Font size in px; the mark scales with it. Below 18px use `LogoMark` alone. */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/** "AULACBOT": the mark + the wordmark in Onest 700 (".app" smaller and quieter when expanded). */
export function Logo({ variant = "main", mono, size = 24, className, style }: LogoProps) {
  const expanded = variant === "expanded";
  return (
    <span
      className={cx("ac-logo", mono && "ac-logo--mono", className)}
      style={{ fontSize: size, ...style }}
      role="img"
      aria-label={expanded ? `${NAME}${TLD}` : NAME}
    >
      <LogoMark />
      {expanded ? (
        <span className="ac-logo__word" aria-hidden="true">
          <span>{NAME}</span>
          <span className="ac-logo__tld">{TLD}</span>
        </span>
      ) : (
        <span aria-hidden="true">{NAME}</span>
      )}
    </span>
  );
}
