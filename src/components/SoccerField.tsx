import React from "react";

const FIELD_WIDTH = 750;
const FIELD_HEIGHT = 1200;
const PADDING = 40;
const SVG_W = FIELD_WIDTH + PADDING * 2;
const SVG_H = FIELD_HEIGHT + PADDING * 2;

// Field dimensions in SVG units (1 unit = 0.1 yards, field = 75x120 yds)
const P = PADDING; // shorthand
const W = FIELD_WIDTH;
const H = FIELD_HEIGHT;

const CENTER_RADIUS = 91.44; // 10 yds
const PENALTY_W = 403.2; // 44 yds wide
const PENALTY_H = 165; // 18 yds deep
const GOAL_AREA_W = 183.6; // 20 yds wide
const GOAL_AREA_H = 55; // 6 yds deep
const CORNER_R = 9.14; // 1 yd
const PENALTY_SPOT_DIST = 110; // 12 yds
const PENALTY_ARC_R = 91.44; // 10 yds

const SoccerField: React.FC = () => {
  const px = (W - PENALTY_W) / 2 + P;
  const gx = (W - GOAL_AREA_W) / 2 + P;

  return (
    <g>
      {/* Grass background with stripes */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect
          key={i}
          x={P}
          y={P + i * (H / 12)}
          width={W}
          height={H / 12}
          fill={i % 2 === 0 ? "hsl(140, 50%, 28%)" : "hsl(140, 50%, 25%)"}
        />
      ))}

      {/* Field outline */}
      <rect x={P} y={P} width={W} height={H} fill="none" stroke="hsl(0,0%,100%)" strokeWidth={2} />

      {/* Halfway line */}
      <line x1={P} y1={P + H / 2} x2={P + W} y2={P + H / 2} stroke="hsl(0,0%,100%)" strokeWidth={2} />

      {/* Center circle */}
      <circle cx={P + W / 2} cy={P + H / 2} r={CENTER_RADIUS} fill="none" stroke="hsl(0,0%,100%)" strokeWidth={2} />
      <circle cx={P + W / 2} cy={P + H / 2} r={4} fill="hsl(0,0%,100%)" />

      {/* Top penalty area */}
      <rect x={px} y={P} width={PENALTY_W} height={PENALTY_H} fill="none" stroke="hsl(0,0%,100%)" strokeWidth={2} />
      <rect x={gx} y={P} width={GOAL_AREA_W} height={GOAL_AREA_H} fill="none" stroke="hsl(0,0%,100%)" strokeWidth={2} />
      <circle cx={P + W / 2} cy={P + PENALTY_SPOT_DIST} r={4} fill="hsl(0,0%,100%)" />
      {/* Top penalty arc */}
      <path
        d={describeArc(P + W / 2, P + PENALTY_SPOT_DIST, PENALTY_ARC_R, PENALTY_H - PENALTY_SPOT_DIST)}
        fill="none"
        stroke="hsl(0,0%,100%)"
        strokeWidth={2}
      />

      {/* Bottom penalty area */}
      <rect x={px} y={P + H - PENALTY_H} width={PENALTY_W} height={PENALTY_H} fill="none" stroke="hsl(0,0%,100%)" strokeWidth={2} />
      <rect x={gx} y={P + H - GOAL_AREA_H} width={GOAL_AREA_W} height={GOAL_AREA_H} fill="none" stroke="hsl(0,0%,100%)" strokeWidth={2} />
      <circle cx={P + W / 2} cy={P + H - PENALTY_SPOT_DIST} r={4} fill="hsl(0,0%,100%)" />
      {/* Bottom penalty arc */}
      <path
        d={describeArc(P + W / 2, P + H - PENALTY_SPOT_DIST, PENALTY_ARC_R, -(PENALTY_H - PENALTY_SPOT_DIST))}
        fill="none"
        stroke="hsl(0,0%,100%)"
        strokeWidth={2}
      />

      {/* Corner arcs */}
      <path d={`M ${P + CORNER_R} ${P} A ${CORNER_R} ${CORNER_R} 0 0 0 ${P} ${P + CORNER_R}`} fill="none" stroke="hsl(0,0%,100%)" strokeWidth={2} />
      <path d={`M ${P + W - CORNER_R} ${P} A ${CORNER_R} ${CORNER_R} 0 0 1 ${P + W} ${P + CORNER_R}`} fill="none" stroke="hsl(0,0%,100%)" strokeWidth={2} />
      <path d={`M ${P} ${P + H - CORNER_R} A ${CORNER_R} ${CORNER_R} 0 0 0 ${P + CORNER_R} ${P + H}`} fill="none" stroke="hsl(0,0%,100%)" strokeWidth={2} />
      <path d={`M ${P + W} ${P + H - CORNER_R} A ${CORNER_R} ${CORNER_R} 0 0 1 ${P + W - CORNER_R} ${P + H}`} fill="none" stroke="hsl(0,0%,100%)" strokeWidth={2} />

      {/* Goals */}
      <rect x={P + W / 2 - 36} y={P - 20} width={72} height={20} fill="none" stroke="hsl(0,0%,70%)" strokeWidth={2} rx={2} />
      <rect x={P + W / 2 - 36} y={P + H} width={72} height={20} fill="none" stroke="hsl(0,0%,70%)" strokeWidth={2} rx={2} />
    </g>
  );
};

function describeArc(cx: number, cy: number, r: number, clipY: number): string {
  // Draw the arc portion of a circle that extends beyond clipY from center
  const dy = Math.abs(clipY);
  if (dy >= r) return "";
  const dx = Math.sqrt(r * r - dy * dy);
  const y = cy + clipY;
  const sweep = clipY > 0 ? 1 : 0;
  return `M ${cx - dx} ${y} A ${r} ${r} 0 0 ${sweep} ${cx + dx} ${y}`;
}

export { SoccerField, SVG_W, SVG_H, PADDING, FIELD_WIDTH, FIELD_HEIGHT };
