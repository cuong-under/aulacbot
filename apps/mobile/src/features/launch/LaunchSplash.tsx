import { CYBER_LAC_COLORS, CYBER_LAC_SQUAD } from "@agenteschat/ui/brand/cyber-lac";
import { Canvas, Fill, Group, Path, Shader, Skia, type SkPath, useClock } from "@shopify/react-native-skia";
import { useNetworkState } from "expo-network";
import { memo, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text as RNText, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { rectsToSvg } from "@/agent/recorder";
import { effectOf } from "@/sky/Dither";
import { paletteUniform } from "@/sky/math";
import { LogoMark, Text } from "@/ui";
import { fonts, useReducedMotion, useTheme } from "@/ui/theme";
import { LAUNCH, LOGO, launchSkyTones, SPRITES, spriteBlinks, spriteY, waitLine } from "./logic";

/** The launch image's centered mark: leave the same room around it as the native image. */
const BOX = Math.ceil(LOGO * 1.5);
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);
const PAD = (BOX - LOGO) / 2;
/** Points per sky cell. */
const PX = 4;
/** The squad's own 16 × 16 grid, three points a side. */
const SPRITE_CELLS = 16;
const SPRITE_PX = 3;
const SPRITE_SIZE = SPRITE_CELLS * SPRITE_PX;

export interface LaunchSplashProps {
  /** The session and the organization are known: it may leave (after its minimum). */
  ready: boolean;
  /** The brand fonts are in (the name waits for them). */
  fontsReady: boolean;
  /** Its first frame is up: the native launch image can go (they look the same). */
  onShown: () => void;
  /** It is gone. */
  onDone: () => void;
  /**
   * What it waits on when the person can act on it (a server that doesn't answer: the reason and its buttons).
   * The mark goes up, the sky with it, and this comes in at the bottom; the splash still leaves once ready.
   */
  waiting?: ReactNode;
  /** The sky at dusk: the app waits on a team's own server, not the Cloud (its sky says which fell silent). */
  dusk?: boolean;
}

/**
 * Opening the app. It starts exactly on the native launch image (the pixel mark centered, 120 pt image),
 * then the pixel sky rises from the bottom with the Cyber Lạc squad going up in it and the name comes in. Once the
 * app is ready (and at least 0.9 s have played) the mark and the name go up and out, the sky sinks and the screen fades into the app. Slow: one
 * line says it's connecting; no network: one line says so. Waiting on the person (`waiting`: a server that
 * doesn't answer) the mark goes up, the sprites keep above the panel that comes in at the bottom, and the
 * splash stays until the app is ready. Reduced motion: the logo still, a short fade.
 */
export function LaunchSplash({ ready, fontsReady, onShown, onDone, waiting, dusk = false }: LaunchSplashProps) {
  const { t } = useTranslation();
  const { colors: c, scheme } = useTheme();
  const reduced = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const network = useNetworkState();
  const offline = network.isConnected === false || network.isInternetReachable === false;

  // Its own timers (the agents' clock can start paused): the minimum, and when to say why it waits.
  const [played, setPlayed] = useState(reduced);
  const [late, setLate] = useState(false);
  useEffect(() => {
    const min = setTimeout(() => setPlayed(true), LAUNCH.min * 1000);
    const why = setTimeout(() => setLate(true), LAUNCH.lineAfter * 1000);
    return () => {
      clearTimeout(min);
      clearTimeout(why);
    };
  }, []);
  // Once it starts leaving it goes, whatever happens next.
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (ready && played) setLeaving(true);
  }, [ready, played]);
  const asking = Boolean(waiting) && !leaving;
  const line = leaving || asking ? null : waitLine(late, offline);

  const level = useSharedValue(0);
  const lift = useSharedValue(0);
  const away = useSharedValue(0);
  const name = useSharedValue(0);
  const lineIn = useSharedValue(0);
  const shown = useSharedValue(1);
  // Waiting on the person: the mark up (0 → 1), the panel in, and where the sprites start (above the panel).
  const up = useSharedValue(0);
  const floor = useSharedValue(0.95);
  const [panelTop, setPanelTop] = useState<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    const rise = { duration: LAUNCH.rise * 1000, easing: Easing.out(Easing.cubic) };
    level.value = withTiming(LAUNCH.sky, rise);
    lift.value = withTiming(1, rise);
    name.value = withDelay(LAUNCH.nameAt * 1000, withTiming(1, { duration: 350 }));
  }, [reduced, level, lift, name]);

  useEffect(() => {
    lineIn.value = withTiming(line ? 1 : 0, { duration: 300 });
  }, [line, lineIn]);

  // Only once it has waited on the person: an ordinary launch keeps its own rise.
  const asked = useRef(false);
  useEffect(() => {
    if (leaving || (!asking && !asked.current)) return;
    asked.current = asking;
    const move = { duration: reduced ? 0 : 450, easing: Easing.inOut(Easing.cubic) };
    up.value = withTiming(asking ? 1 : 0, move);
    if (!reduced) level.value = withTiming(asking ? LAUNCH.waitingSky : LAUNCH.sky, move);
    // The sprites rise from just above the panel (a sprite's height and a little more), so none crosses its text.
    const above = panelTop === null ? 0.95 : (panelTop - SPRITE_SIZE - 12) / height;
    floor.value = withTiming(asking ? Math.min(0.95, above) : 0.95, move);
  }, [asking, leaving, reduced, panelTop, height, up, level, floor]);

  const done = useRef(onDone);
  done.current = onDone;
  const finish = useCallback(() => done.current(), []);
  useEffect(() => {
    if (!leaving) return;
    const end = (finished?: boolean) => {
      "worklet";
      if (finished) scheduleOnRN(finish);
    };
    if (reduced) {
      shown.value = withTiming(0, { duration: LAUNCH.reducedExit * 1000 }, end);
      return;
    }
    // The handover into the app, one gesture: the mark lifts away toward the top (where the app's bar will be) as
    // the sky sinks to the horizon and the splash thins out over the screen under it, so the home is seen arriving
    // through it rather than cut to. On-screen moves on the strong ease-in-out, the fade on ease-out.
    const ms = LAUNCH.exit * 1000;
    away.value = withTiming(1, { duration: ms * 0.6, easing: EASE_IN_OUT });
    level.value = withTiming(0, { duration: ms, easing: EASE_IN_OUT });
    shown.value = withDelay(ms * 0.25, withTiming(0, { duration: ms * 0.75, easing: EASE_OUT }, end));
  }, [leaving, reduced, away, level, shown, finish]);

  // The native image goes once this first frame is laid out (it looks the same).
  const shownOnce = useRef(false);
  const onLayout = () => {
    if (shownOnce.current) return;
    shownOnce.current = true;
    requestAnimationFrame(onShown);
  };

  const overlay = useAnimatedStyle(() => ({ opacity: shown.value }));
  const raise = height * (0.5 - LAUNCH.waitingAgent);
  const mark = useAnimatedStyle(() => ({
    opacity: 1 - away.value,
    transform: [
      { translateY: -LAUNCH.lift * lift.value - raise * up.value - 96 * away.value },
      { scale: 1 - 0.3 * away.value },
    ],
  }));
  const panelStyle = useAnimatedStyle(() => ({ opacity: up.value * (1 - away.value) }));
  const nameStyle = useAnimatedStyle(() => ({ opacity: name.value }));
  const lineStyle = useAnimatedStyle(() => ({ opacity: lineIn.value }));
  const tones = useMemo(() => launchSkyTones(c.bg, scheme === "dark", dusk), [c.bg, scheme, dusk]);
  const lineText = line ? t(`mobile.splash.${line}`) : "";

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { backgroundColor: c.bg }, overlay]}
      pointerEvents={leaving ? "none" : "auto"}
      onLayout={onLayout}
      // One element for screen readers, except while it waits on the person: then its buttons are reachable.
      accessible={!asking}
      accessibilityLabel={lineText ? `AULACBOT. ${lineText}` : "AULACBOT"}
      accessibilityLiveRegion="polite"
    >
      {reduced ? null : <LaunchSky width={width} height={height} level={level} floor={floor} tones={tones} />}
      <Animated.View
        style={[styles.mark, { left: width / 2 - BOX / 2, top: height / 2 - BOX / 2 }, mark]}
        pointerEvents="none"
      >
        <View style={styles.markImage}>
          <LogoMark size={LOGO} />
        </View>
        {fontsReady ? (
          <Animated.View style={[styles.name, reduced ? styles.still : nameStyle]}>
            <RNText allowFontScaling={false} style={[styles.word, { color: c.ink }]}>
              AULACBOT
            </RNText>
          </Animated.View>
        ) : null}
        <Animated.View style={[styles.line, lineStyle]}>
          <Text variant="callout" tone="muted" style={styles.center}>
            {lineText}
          </Text>
        </Animated.View>
      </Animated.View>
      {waiting ? (
        <Animated.View
          style={[styles.panel, { paddingBottom: insets.bottom + 24 }, panelStyle]}
          pointerEvents={asking ? "auto" : "none"}
        >
          <View onLayout={(e) => setPanelTop(height - insets.bottom - 24 - e.nativeEvent.layout.height)}>
            {waiting}
          </View>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

/**
 * The sky rising to `level`, and the Cyber Lạc squad going up in it (all on the UI thread).
 */
const LaunchSky = memo(function LaunchSky({
  width,
  height,
  level,
  floor,
  tones,
}: {
  width: number;
  height: number;
  level: SharedValue<number>;
  /** Where the sprites start rising (`spriteY`'s bottom). */
  floor: SharedValue<number>;
  tones: string[];
}) {
  const effect = effectOf("horizon");
  const clock = useClock();
  const { pal, last } = useMemo(() => paletteUniform(tones), [tones]);
  const uniforms = useDerivedValue(() => ({
    size: [width, height],
    px: PX,
    t: clock.value / 1000,
    last,
    fade: 2,
    // Every uniform of the shared sky shader must be given (Skia throws on a missing one): no fade in from the top.
    fadeTop: 0,
    clear: 0,
    pal,
    level: level.value,
  }));
  const glyphs = useMemo(
    () =>
      CYBER_LAC_SQUAD.map((member) => {
        const byColor = new Map<string, number[]>();
        const eyeRects: number[] = [];
        member.rows.forEach((row, y) => {
          [...row].forEach((cell, x) => {
            if (cell === ".") return;
            const left = x * SPRITE_PX;
            const top = y * SPRITE_PX;
            if (cell === "w") {
              eyeRects.push(left, top, SPRITE_PX, SPRITE_PX);
              return;
            }
            const color = CYBER_LAC_COLORS[cell];
            if (!color) return;
            const rects = byColor.get(color) ?? [];
            rects.push(left, top, SPRITE_PX, SPRITE_PX);
            byColor.set(color, rects);
          });
        });
        const fills = [...byColor.entries()].flatMap(([color, rects]) => {
          const path = Skia.Path.MakeFromSVGString(rectsToSvg(rects));
          return path ? [{ color, path }] : [];
        });
        return { fills, eyes: Skia.Path.MakeFromSVGString(rectsToSvg(eyeRects)) };
      }),
    [],
  );
  if (!effect) return null;
  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Fill>
        <Shader source={effect} uniforms={uniforms} />
      </Fill>
      {SPRITES.map((sprite) => {
        const glyph = glyphs[sprite.lac];
        return glyph && glyph.fills.length > 0 ? (
          <Sprite
            key={sprite.x}
            sprite={sprite}
            clock={clock}
            level={level}
            floor={floor}
            width={width}
            height={height}
            fills={glyph.fills}
            eyes={glyph.eyes}
          />
        ) : null;
      })}
    </Canvas>
  );
});

function Sprite({
  sprite,
  clock,
  level,
  floor,
  width,
  height,
  fills,
  eyes,
}: {
  sprite: (typeof SPRITES)[number];
  clock: SharedValue<number>;
  level: SharedValue<number>;
  floor: SharedValue<number>;
  width: number;
  height: number;
  fills: { color: string; path: SkPath }[];
  eyes: SkPath | null;
}) {
  // On the sky's grid, like the prototype's sprites.
  const x = Math.round((sprite.x * (width - SPRITE_SIZE)) / PX) * PX;
  const transform = useDerivedValue(() => {
    const y = spriteY(sprite, clock.value / 1000, level.value, floor.value);
    return [{ translateX: x }, { translateY: y === null ? -100 : Math.round((y * height) / PX) * PX }];
  });
  const opacity = useDerivedValue(() =>
    spriteY(sprite, clock.value / 1000, level.value, floor.value) === null ? 0 : 1,
  );
  const eyeColor = useDerivedValue(() =>
    spriteBlinks(sprite, clock.value / 1000) ? "transparent" : CYBER_LAC_COLORS.w,
  );
  return (
    <Group transform={transform} opacity={opacity}>
      {fills.map((fill) => (
        <Path key={fill.color} path={fill.path} color={fill.color} />
      ))}
      {eyes ? <Path path={eyes} color={eyeColor} /> : null}
    </Group>
  );
}

const styles = StyleSheet.create({
  mark: { position: "absolute", width: BOX, height: BOX },
  markImage: { position: "absolute", left: PAD, top: PAD, width: LOGO, height: LOGO },
  // Under the mark (the canvas has room around it), centered on the image.
  name: { position: "absolute", top: PAD + LOGO + 18, left: BOX / 2 - 160, width: 320, alignItems: "center" },
  // The wordmark: Onest 700 with the lockup's +0.055em tracking, as on the web, the desktop and the terminal.
  word: { fontFamily: fonts.brand, fontSize: 30, lineHeight: 38, letterSpacing: 1.65 },
  line: { position: "absolute", top: PAD + LOGO + 64, left: BOX / 2 - 160, width: 320, alignItems: "center" },
  center: { textAlign: "center" },
  panel: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 24 },
  still: { opacity: 1 },
});
