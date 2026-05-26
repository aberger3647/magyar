import * as React from "react";
import emotionsData from "@/assets/emotions.json";
import {
  arcSpec,
  degToRad,
  mixCoreColor,
  polarToCartesian,
  WHEEL,
  type ArcSpec,
} from "@/lib/wheelGeometry";
import {
  displayHungarian,
  type EmotionCore,
  type EmotionLeaf,
  type EmotionsData,
} from "@/types/emotions";
import { cn } from "@/lib/utils";

type Ring = "core" | "secondary" | "tertiary";

export type WheelSegment = EmotionLeaf & {
  ring: Ring;
  path: string;
  fill: string;
  startRad: number;
  endRad: number;
  innerR: number;
  outerR: number;
  midAngle: number;
  midRadius: number;
  fontSize: number;
};

const data = emotionsData as EmotionsData;

function ringColor(
  core: EmotionCore,
  ring: Ring,
): string {
  const t = ring === "core" ? 0 : ring === "secondary" ? 0.45 : 1;
  return mixCoreColor(core.color.base, core.color.light, t);
}

function ringRadii(ring: Ring): { inner: number; outer: number } {
  switch (ring) {
    case "core":
      return { inner: WHEEL.rCoreInner, outer: WHEEL.rCoreOuter };
    case "secondary":
      return { inner: WHEEL.rCoreOuter, outer: WHEEL.rSecondaryOuter };
    case "tertiary":
      return { inner: WHEEL.rSecondaryOuter, outer: WHEEL.rTertiaryOuter };
  }
}

function fontSizeForRing(ring: Ring): number {
  switch (ring) {
    case "core":
      return 22;
    case "secondary":
      return 11;
    case "tertiary":
      return 8;
  }
}

function maxOuterForRing(ring: Ring): number {
  switch (ring) {
    case "core":
      return WHEEL.rCoreOuter;
    case "secondary":
      return WHEEL.rSecondaryOuter;
    case "tertiary":
      return WHEEL.rTertiaryOuter;
  }
}

/** Grow wedge outward (and slightly wider); inner edge stays fixed — no gaps. */
const HOVER_OUTER_EXPAND: Record<Ring, number> = {
  core: 22,
  secondary: 26,
  tertiary: 0,
};
const HOVER_ANGLE_EXPAND_RAD = 0.022;
const HOVER_FONT_SCALE = 1.38;

function activeArc(segment: WheelSegment): ArcSpec {
  const { cx, cy } = WHEEL;
  let { startRad, endRad, innerR, outerR } = segment;
  const maxOuter = maxOuterForRing(segment.ring);
  outerR = Math.min(outerR + HOVER_OUTER_EXPAND[segment.ring], maxOuter);
  const anglePad =
    outerR >= maxOuter - 0.5
      ? HOVER_ANGLE_EXPAND_RAD
      : HOVER_ANGLE_EXPAND_RAD * 0.35;
  return arcSpec(
    cx,
    cy,
    innerR,
    outerR,
    startRad - anglePad,
    endRad + anglePad,
  );
}

function pushSegment(
  segments: WheelSegment[],
  leaf: EmotionLeaf,
  ring: Ring,
  fill: string,
  inner: number,
  outer: number,
  startDeg: number,
  endDeg: number,
) {
  const arc = arcSpec(
    WHEEL.cx,
    WHEEL.cy,
    inner,
    outer,
    degToRad(startDeg),
    degToRad(endDeg),
  );
  segments.push({
    ...leaf,
    ring,
    path: arc.path,
    fill,
    startRad: degToRad(startDeg),
    endRad: degToRad(endDeg),
    innerR: inner,
    outerR: outer,
    midAngle: arc.midAngle,
    midRadius: arc.midRadius,
    fontSize: fontSizeForRing(ring),
  });
}

function buildSegments(): WheelSegment[] {
  const segments: WheelSegment[] = [];
  const { coreSpanDeg, startDeg } = WHEEL;

  data.cores.forEach((core, coreIndex) => {
    const coreStartDeg = startDeg + coreIndex * coreSpanDeg;
    const coreEndDeg = coreStartDeg + coreSpanDeg;
    const secCount = core.secondary.length;
    const secSpan = coreSpanDeg / secCount;

    pushSegment(
      segments,
      core,
      "core",
      ringColor(core, "core"),
      WHEEL.rCoreInner,
      WHEEL.rCoreOuter,
      coreStartDeg,
      coreEndDeg,
    );

    core.secondary.forEach((sec, secIndex) => {
      const secStartDeg = coreStartDeg + secIndex * secSpan;
      const secEndDeg = secStartDeg + secSpan;
      const { inner, outer } = ringRadii("secondary");

      pushSegment(
        segments,
        sec,
        "secondary",
        ringColor(core, "secondary"),
        inner,
        outer,
        secStartDeg,
        secEndDeg,
      );

      const tertSpan = secSpan / 2;
      sec.tertiary.forEach((tert, tertIndex) => {
        const tertStartDeg = secStartDeg + tertIndex * tertSpan;
        const tertEndDeg = tertStartDeg + tertSpan;
        const tertRadii = ringRadii("tertiary");

        pushSegment(
          segments,
          tert,
          "tertiary",
          ringColor(core, "tertiary"),
          tertRadii.inner,
          tertRadii.outer,
          tertStartDeg,
          tertEndDeg,
        );
      });
    });
  });

  return segments;
}

const ALL_SEGMENTS = buildSegments();

/** Radial orientation along each wedge (90° from tangential). */
function labelRotation(midAngleRad: number): number {
  let deg = (midAngleRad * 180) / Math.PI;
  if (deg > 90 && deg < 270) deg += 180;
  return deg;
}

function labelFontSize(ring: Ring, baseSize: number, text: string): number {
  const len = text.length;
  if (ring === "core") return baseSize;
  if (ring === "secondary") return len > 14 ? baseSize * 0.82 : baseSize;
  return len > 12 ? baseSize * 0.75 : len > 9 ? baseSize * 0.88 : baseSize;
}

function SegmentLabel({
  midAngle,
  midRadius,
  fontSize,
  ring,
  hu,
  en,
  isActive,
}: {
  midAngle: number;
  midRadius: number;
  fontSize: number;
  ring: Ring;
  hu: string;
  en: string;
  isActive: boolean;
}) {
  const { x, y } = polarToCartesian(WHEEL.cx, WHEEL.cy, midRadius, midAngle);
  const rotation = labelRotation(midAngle);
  const huLabel = displayHungarian(hu, en);
  const showHu = isActive && hu.trim() !== "";
  const size = labelFontSize(ring, fontSize, en);
  const huSize = size * (ring === "core" ? 0.78 : 0.72);
  const lineGap = size * 1.1;

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      transform={`rotate(${rotation}, ${x}, ${y})`}
      fontSize={size}
      fontWeight={ring === "core" ? 700 : 500}
      fill="#000"
      pointerEvents="none"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {showHu ? (
        <>
          <tspan x={x} dy={-lineGap / 2}>
            {en}
          </tspan>
          <tspan x={x} dy={lineGap} fontSize={huSize} fontWeight={500}>
            {huLabel}
          </tspan>
        </>
      ) : (
        en
      )}
    </text>
  );
}

export function EmotionsWheel() {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const active = React.useMemo(
    () => ALL_SEGMENTS.find((s) => s.id === activeId) ?? null,
    [activeId],
  );

  const huDisplay = active
    ? displayHungarian(active.hu, active.en)
    : null;
  const isFallback = active !== null && active.hu.trim() === "";

  const renderOrder = React.useMemo(() => {
    if (!activeId) return ALL_SEGMENTS;
    const hovered = ALL_SEGMENTS.filter((s) => s.id === activeId);
    const rest = ALL_SEGMENTS.filter((s) => s.id !== activeId);
    return [...rest, ...hovered];
  }, [activeId]);

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-6">
      <div
        ref={containerRef}
        className="w-full"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setActiveId(null);
        }}
      >
        <svg
          viewBox="0 0 1000 1000"
          className="mx-auto h-auto w-full max-h-[min(90vh,800px)]"
          role="img"
          aria-label="Emotions wheel"
          onMouseLeave={() => setActiveId(null)}
          onPointerDown={(e) => {
            const target = e.target as SVGElement;
            if (target.tagName === "svg") setActiveId(null);
          }}
        >
          {renderOrder.map((segment) => {
            const isActive = activeId === segment.id;
            const hoverArc = isActive ? activeArc(segment) : null;
            const displayPath = hoverArc?.path ?? segment.path;
            const labelAngle = hoverArc?.midAngle ?? segment.midAngle;
            const labelRadius = hoverArc?.midRadius ?? segment.midRadius;
            const labelSize = isActive
              ? segment.fontSize * HOVER_FONT_SCALE
              : segment.fontSize;

            return (
              <g key={segment.id}>
                <path
                  d={segment.path}
                  fill="transparent"
                  stroke="none"
                  className="cursor-pointer outline-none focus:outline-none focus-visible:outline-none"
                  role="button"
                  tabIndex={0}
                  aria-label={`${segment.en} — ${displayHungarian(segment.hu, segment.en)}`}
                  onMouseEnter={() => setActiveId(segment.id)}
                  onFocus={() => setActiveId(segment.id)}
                  onClick={() => setActiveId(segment.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveId(segment.id);
                    }
                  }}
                />
                <path
                  d={displayPath}
                  fill={segment.fill}
                  stroke="#000"
                  strokeWidth={isActive ? 1.5 : 0.5}
                  pointerEvents="none"
                  className={cn(
                    "transition-[filter,stroke-width] duration-150",
                    isActive && "brightness-110",
                  )}
                  style={
                    isActive
                      ? { filter: "brightness(1.08)" }
                      : undefined
                  }
                />
                <SegmentLabel
                  midAngle={labelAngle}
                  midRadius={labelRadius}
                  fontSize={labelSize}
                  ring={segment.ring}
                  hu={segment.hu}
                  en={segment.en}
                  isActive={isActive}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div
        className="min-h-[5rem] w-full rounded-md border bg-card p-4 text-center"
        aria-live="polite"
      >
        {active ? (
          <div className="flex flex-col gap-1">
            <p className="text-2xl font-bold tracking-wide">{active.en}</p>
            <p className="text-lg">
              <span className="text-muted-foreground">Magyar: </span>
              {huDisplay}
            </p>
            {isFallback && (
              <p className="text-xs text-muted-foreground">
                (add Hungarian in emotions.json)
              </p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">Hover or tap an emotion</p>
        )}
      </div>
    </div>
  );
}
