import * as React from "react";
import emotionsData from "@/assets/emotions.json";
import {
  angleDegFromCenter,
  arcSpec,
  contrastTextColor,
  degToRad,
  familyCentroid,
  mixCoreColor,
  normalizeAngleDelta,
  polarToCartesian,
  WHEEL,
} from "@/lib/wheelGeometry";
import {
  displayHungarian,
  type EmotionCore,
  type EmotionLeaf,
  type EmotionsData,
} from "@/types/emotions";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

type Ring = "core" | "secondary" | "tertiary";

export type WheelSegment = EmotionLeaf & {
  ring: Ring;
  coreId: string;
  coreIndex: number;
  path: string;
  fillLight: string;
  fillDark: string;
  startRad: number;
  endRad: number;
  innerR: number;
  outerR: number;
  midAngle: number;
  midRadius: number;
  fontSize: number;
};

const data = emotionsData as EmotionsData;

/** How far each ring's color shifts toward the theme's light extreme. */
const RING_MIX_T_LIGHT: Record<Ring, number> = {
  core: 0,
  secondary: 0.45,
  tertiary: 1,
};

/** How far each ring shifts toward black in dark mode — capped below 1 so
 * outer rings stay tinted by the core hue instead of collapsing to the same
 * near-black shade across every family. */
const RING_MIX_T_DARK: Record<Ring, number> = {
  core: 0,
  secondary: 0.35,
  tertiary: 0.65,
};

/** Near-black tone the outer rings mix toward in dark mode. */
const DARK_MIX_TARGET = "#0b1120";

function ringColorLight(core: EmotionCore, ring: Ring): string {
  return mixCoreColor(core.color.base, core.color.light, RING_MIX_T_LIGHT[ring]);
}

function ringColorDark(core: EmotionCore, ring: Ring): string {
  return mixCoreColor(core.color.base, DARK_MIX_TARGET, RING_MIX_T_DARK[ring]);
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

/** How far the wheel scales up when zoomed into a hovered family. */
const FAMILY_ZOOM_SCALE = 1.9;

function pushSegment(
  segments: WheelSegment[],
  leaf: EmotionLeaf,
  ring: Ring,
  coreId: string,
  coreIndex: number,
  core: EmotionCore,
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
    coreId,
    coreIndex,
    path: arc.path,
    fillLight: ringColorLight(core, ring),
    fillDark: ringColorDark(core, ring),
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
      core.id,
      coreIndex,
      core,
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
        core.id,
        coreIndex,
        core,
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
          core.id,
          coreIndex,
          core,
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

const DRAG_THRESHOLD_DEG = 4;

function clientToSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;
  return pt.matrixTransform(matrix.inverse());
}

/** Radial orientation (degrees) for a label at the given on-screen angle. */
function labelRotation(absAngleDeg: number): number {
  let deg = ((absAngleDeg % 360) + 360) % 360; // normalize to [0,360)
  if (deg > 90 && deg < 270) deg += 180; // flip left-half so text isn't upside down
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
  rotationDeg,
  ring,
  hu,
  en,
  isActive,
  inActiveFamily,
  textColor,
}: {
  midAngle: number;
  midRadius: number;
  fontSize: number;
  rotationDeg: number;
  ring: Ring;
  hu: string;
  en: string;
  isActive: boolean;
  inActiveFamily: boolean;
  textColor: string;
}) {
  const { x, y } = polarToCartesian(WHEEL.cx, WHEEL.cy, midRadius, midAngle);
  // Orient from the label's current on-screen angle, then cancel the group
  // rotation the text inherits — so words stay readable at any wheel rotation.
  const absAngleDeg = (midAngle * 180) / Math.PI + rotationDeg;
  const rotation = labelRotation(absAngleDeg) - rotationDeg;
  const huLabel = displayHungarian(hu, en);
  const showHu = (isActive || inActiveFamily) && hu.trim() !== "";
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
      fill={textColor}
      pointerEvents="none"
      style={{ fontFamily: "system-ui, sans-serif", transition: "fill 150ms" }}
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
  const { resolved } = useTheme();
  const isDark = resolved === "dark";
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [rotationDeg, setRotationDeg] = React.useState(0);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const dragRef = React.useRef<{
    pointerId: number;
    startAngleDeg: number;
    startRotationDeg: number;
  } | null>(null);
  const isDraggingRef = React.useRef(false);
  const suppressClickRef = React.useRef(false);

  const active = React.useMemo(
    () => ALL_SEGMENTS.find((s) => s.id === activeId) ?? null,
    [activeId],
  );

  const huDisplay = active
    ? displayHungarian(active.hu, active.en)
    : null;
  const isFallback = active !== null && active.hu.trim() === "";

  const activeCoreId = active?.coreId ?? null;

  const renderOrder = React.useMemo(() => {
    if (!activeCoreId) return ALL_SEGMENTS;
    const others = ALL_SEGMENTS.filter((s) => s.coreId !== activeCoreId);
    const family = ALL_SEGMENTS.filter(
      (s) => s.coreId === activeCoreId && s.id !== activeId,
    );
    const hovered = ALL_SEGMENTS.filter((s) => s.id === activeId);
    return [...others, ...family, ...hovered];
  }, [activeCoreId, activeId]);

  // Camera zoom: move the hovered family's centroid to the SVG centre and scale
  // up. The translate target is the rotation pivot, so this composes cleanly
  // with drag-rotation regardless of the current angle.
  const zoomTransform = React.useMemo(() => {
    if (!active) return "translate(0px, 0px) scale(1)";
    const k = FAMILY_ZOOM_SCALE;
    const { x: px, y: py } = familyCentroid(active.coreIndex);
    return `translate(${WHEEL.cx - k * px}px, ${WHEEL.cy - k * py}px) scale(${k})`;
  }, [active]);

  const pointerAngleDeg = React.useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const local = clientToSvgPoint(svg, clientX, clientY);
    if (!local) return 0;
    return angleDegFromCenter(local.x, local.y, WHEEL.cx, WHEEL.cy);
  }, []);

  const endDrag = React.useCallback((pointerId: number) => {
    const svg = svgRef.current;
    if (svg?.hasPointerCapture(pointerId)) {
      svg.releasePointerCapture(pointerId);
    }
    const wasDragging = isDraggingRef.current;
    dragRef.current = null;
    isDraggingRef.current = false;
    if (wasDragging) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }, []);

  const onWheelPointerDown = React.useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (e.button !== 0) return;
      dragRef.current = {
        pointerId: e.pointerId,
        startAngleDeg: pointerAngleDeg(e.clientX, e.clientY),
        startRotationDeg: rotationDeg,
      };
      isDraggingRef.current = false;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [pointerAngleDeg, rotationDeg],
  );

  const onWheelPointerMove = React.useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;
      const angle = pointerAngleDeg(e.clientX, e.clientY);
      const delta = normalizeAngleDelta(angle - drag.startAngleDeg);
      if (!isDraggingRef.current && Math.abs(delta) >= DRAG_THRESHOLD_DEG) {
        isDraggingRef.current = true;
        setActiveId(null);
      }
      if (isDraggingRef.current) {
        e.preventDefault();
        setRotationDeg(drag.startRotationDeg + delta);
      }
    },
    [pointerAngleDeg],
  );

  const onWheelPointerUp = React.useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (dragRef.current?.pointerId === e.pointerId) {
        endDrag(e.pointerId);
      }
    },
    [endDrag],
  );

  const selectSegment = React.useCallback((id: string) => {
    if (suppressClickRef.current || isDraggingRef.current) return;
    setActiveId(id);
  }, []);

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-6">
      <div
        className="w-full"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setActiveId(null);
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1000 1000"
          className="mx-auto h-auto w-full max-h-[min(90vh,800px)] cursor-grab touch-none overflow-hidden active:cursor-grabbing"
          role="img"
          aria-label="Emotions wheel — drag to rotate"
          onMouseLeave={() => {
            if (!isDraggingRef.current) setActiveId(null);
          }}
          onPointerDown={onWheelPointerDown}
          onPointerMove={onWheelPointerMove}
          onPointerUp={onWheelPointerUp}
          onPointerCancel={onWheelPointerUp}
        >
          <g transform={`rotate(${rotationDeg} ${WHEEL.cx} ${WHEEL.cy})`}>
            <g
              style={{
                transform: zoomTransform,
                transformBox: "view-box",
                transformOrigin: "0px 0px",
                transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: "transform",
              }}
            >
              {renderOrder.map((segment) => {
                const isActive = activeId === segment.id;
                const inActiveFamily =
                  activeCoreId != null && segment.coreId === activeCoreId;
                const fill = isDark ? segment.fillDark : segment.fillLight;

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
                      onMouseEnter={() => {
                        if (!isDraggingRef.current) setActiveId(segment.id);
                      }}
                      onFocus={() => selectSegment(segment.id)}
                      onClick={() => selectSegment(segment.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          selectSegment(segment.id);
                        }
                      }}
                    />
                    <path
                      d={segment.path}
                      fill={fill}
                      stroke={isDark ? "#e8e6e1" : "#000"}
                      strokeOpacity={isDark ? 0.35 : 1}
                      strokeWidth={isActive ? 1.5 : 0.5}
                      pointerEvents="none"
                      className={cn(
                        "transition-[fill,filter,stroke,stroke-width] duration-150",
                        isActive && "brightness-110",
                      )}
                      style={
                        isActive ? { filter: "brightness(1.08)" } : undefined
                      }
                    />
                    <SegmentLabel
                      midAngle={segment.midAngle}
                      midRadius={segment.midRadius}
                      fontSize={segment.fontSize}
                      rotationDeg={rotationDeg}
                      ring={segment.ring}
                      hu={segment.hu}
                      en={segment.en}
                      isActive={isActive}
                      inActiveFamily={inActiveFamily}
                      textColor={contrastTextColor(fill)}
                    />
                  </g>
                );
              })}
            </g>
          </g>
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
          <p className="text-muted-foreground">
            Drag to rotate · hover or tap an emotion
          </p>
        )}
      </div>
    </div>
  );
}
