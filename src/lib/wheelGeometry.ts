const DEG = Math.PI / 180;

export type ArcSpec = {
  path: string;
  midAngle: number;
  midRadius: number;
};

export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleRad: number,
): { x: number; y: number } {
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

/** Annular wedge from startRad to endRad (radians, 0 = 3 o'clock, clockwise positive). */
export function describeArc(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startRad: number,
  endRad: number,
): string {
  const largeArc = endRad - startRad > Math.PI ? 1 : 0;
  const outerStart = polarToCartesian(cx, cy, rOuter, startRad);
  const outerEnd = polarToCartesian(cx, cy, rOuter, endRad);
  const innerEnd = polarToCartesian(cx, cy, rInner, endRad);
  const innerStart = polarToCartesian(cx, cy, rInner, startRad);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

export function arcSpec(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startRad: number,
  endRad: number,
): ArcSpec {
  return {
    path: describeArc(cx, cy, rInner, rOuter, startRad, endRad),
    midAngle: (startRad + endRad) / 2,
    midRadius: (rInner + rOuter) / 2,
  };
}

/** Convert degrees to radians; 0° = 3 o'clock, positive = clockwise. */
export function degToRad(deg: number): number {
  return deg * DEG;
}

/** Angle in degrees from wheel center to a point (0° = 3 o'clock, clockwise). */
export function angleDegFromCenter(x: number, y: number, cx: number, cy: number): number {
  return (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
}

export function normalizeAngleDelta(deltaDeg: number): number {
  let d = deltaDeg;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

export const WHEEL = {
  cx: 500,
  cy: 500,
  rCoreInner: 80,
  rCoreOuter: 200,
  rSecondaryOuter: 380,
  rTertiaryOuter: 500,
  coreSpanDeg: 60,
  /** Happy centered at 12 o'clock → wedge starts at -120° */
  startDeg: -120,
} as const;

/** Radius at which a core family is centered when the wheel zooms into it. */
export const FAMILY_FOCUS_RADIUS = 310;

/** Mid-angle (degrees) of a core family's 60° wedge, by core index. */
export function familyMidAngleDeg(coreIndex: number): number {
  return WHEEL.startDeg + coreIndex * WHEEL.coreSpanDeg + WHEEL.coreSpanDeg / 2;
}

/** Point to center the camera on when zooming into a core family. */
export function familyCentroid(coreIndex: number): { x: number; y: number } {
  return polarToCartesian(
    WHEEL.cx,
    WHEEL.cy,
    FAMILY_FOCUS_RADIUS,
    degToRad(familyMidAngleDeg(coreIndex)),
  );
}

function parseHex(hex: string): readonly [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ] as const;
}

/** Interpolate hex color between base (inner) and light (outer) by ring 0–1. */
export function mixCoreColor(base: string, light: string, t: number): string {
  const [r0, g0, b0] = parseHex(base);
  const [r1, g1, b1] = parseHex(light);
  const r = Math.round(r0 + (r1 - r0) * t);
  const g = Math.round(g0 + (g1 - g0) * t);
  const b = Math.round(b0 + (b1 - b0) * t);
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

/** WCAG relative luminance of a hex color, for contrast decisions. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Best-contrast label color (near-black or near-white) for a wedge fill. */
export function contrastTextColor(hex: string): string {
  return relativeLuminance(hex) > 0.42 ? "#171310" : "#f5f2ec";
}
