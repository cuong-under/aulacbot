import type { HTMLAttributes } from "react";
import { cx } from "../cx";
import { CYBER_LAC_COLORS, CYBER_LAC_EYES, CYBER_LAC_SQUAD, type CyberLacIndex, type CyberLacState } from "./cyber-lac";

/**
 * The Cyber Lạc squad: three pixel heads in the brand's own grid, for the drawings that show who works where.
 * The King stands in the middle (gold crown, jade helmet), the General keeps the gold line and the Sage carries
 * the mint signal. Every cell is one pixel: `shapeRendering` keeps the edges whole at any size.
 */
export interface CyberLacGlyphProps {
  index: CyberLacIndex;
  state?: CyberLacState;
  className?: string;
}

/** One member of the squad, drawn as a 16 × 16 pixel head. */
export function CyberLacGlyph({ index, state = "idle", className }: CyberLacGlyphProps) {
  const member = CYBER_LAC_SQUAD[index];
  const sleeping = state === "sleeping";
  return (
    <svg className={cx("ac-lac-glyph", className)} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      {member.rows.flatMap((row, y) =>
        [...row].map((cell, x) => {
          if (cell === "." || (sleeping && cell === "w")) return null;
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed drawing, cells by their place
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={CYBER_LAC_COLORS[cell]} />;
        }),
      )}
      {sleeping &&
        (CYBER_LAC_EYES[index] ?? []).map((eye) => (
          <rect
            key={`lid-${eye.x}-${eye.y}`}
            x={eye.x}
            y={eye.y}
            width={eye.width}
            height={1}
            fill={CYBER_LAC_COLORS.n}
          />
        ))}
      {sleeping && (
        <g className="ac-lac-glyph__zzz" fill={CYBER_LAC_COLORS.n}>
          <rect x="13" y="0" width="3" height="1" />
          <rect x="15" y="1" width="1" height="1" />
          <rect x="14" y="2" width="1" height="1" />
          <rect x="13" y="3" width="3" height="1" />
        </g>
      )}
    </svg>
  );
}

export interface CyberLacAvatarProps extends HTMLAttributes<HTMLSpanElement> {
  index: CyberLacIndex;
  state?: CyberLacState;
}

/** The same head in the shared avatar box, so it can stand where an agent's face stands. */
export function CyberLacAvatar({ index, state = "idle", className, ...rest }: CyberLacAvatarProps) {
  return (
    <span
      className={cx("ac-avatar", "ac-avatar--agent", "ac-lac-avatar", className)}
      data-lac={index}
      data-state={state}
      aria-hidden="true"
      {...rest}
    >
      <CyberLacGlyph index={index} state={state} />
    </span>
  );
}
