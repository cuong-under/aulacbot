import {
  CYBER_LAC_COLORS,
  CYBER_LAC_EYES,
  CYBER_LAC_SQUAD,
  type CyberLacIndex,
  type CyberLacState,
} from "@agenteschat/ui/brand/cyber-lac";
import Svg, { G, Rect } from "react-native-svg";

/**
 * One member of the Cyber Lạc squad, on the phone: the same 16 × 16 grid the web draws, with closed lids and a
 * mint `z` while sleeping.
 */
export function CyberLacAvatar({
  index,
  size,
  state = "idle",
}: {
  index: CyberLacIndex;
  size: number;
  state?: CyberLacState;
}) {
  const member = CYBER_LAC_SQUAD[index];
  const sleeping = state === "sleeping";
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {member.rows.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === "." || (sleeping && cell === "w") ? null : (
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed drawing, cells by their place
            <Rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={CYBER_LAC_COLORS[cell]} />
          ),
        ),
      )}
      {sleeping
        ? (CYBER_LAC_EYES[index] ?? []).map((eye) => (
            <Rect
              key={`lid-${eye.x}-${eye.y}`}
              x={eye.x}
              y={eye.y}
              width={eye.width}
              height={1}
              fill={CYBER_LAC_COLORS.n}
            />
          ))
        : null}
      {sleeping ? (
        <G fill={CYBER_LAC_COLORS.n}>
          <Rect x={13} y={0} width={3} height={1} />
          <Rect x={15} y={1} width={1} height={1} />
          <Rect x={14} y={2} width={1} height={1} />
          <Rect x={13} y={3} width={3} height={1} />
        </G>
      ) : null}
    </Svg>
  );
}
