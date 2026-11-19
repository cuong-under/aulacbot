import {
  CYBER_LAC_PIXEL_COLORS,
  CYBER_LAC_PIXEL_MARK,
  type CyberLacPixel,
} from "@agenteschat/ui/brand/logo-mark";
import Svg, { Rect } from "react-native-svg";

/**
 * The workspace's 12 × 12 Cyber Lạc pixel mark, shared with the web and terminal.
 */
export function LogoMark({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" accessibilityElementsHidden importantForAccessibility="no">
      {CYBER_LAC_PIXEL_MARK.flatMap((row, y) =>
        [...row].map((pixel, x) =>
          pixel === "." ? null : (
            <Rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={CYBER_LAC_PIXEL_COLORS[pixel as CyberLacPixel]}
            />
          ),
        ),
      )}
    </Svg>
  );
}
