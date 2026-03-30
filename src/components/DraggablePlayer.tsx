import React, { useCallback, useRef, useState } from "react";

export interface Player {
  id: number;
  x: number;
  y: number;
  number: number;
  team: "home" | "away";
  label?: string;
}

interface DraggablePlayerProps {
  player: Player;
  selected: boolean;
  onSelect: (id: number) => void;
  onMove: (id: number, x: number, y: number) => void;
  svgRef: React.RefObject<SVGSVGElement>;
}

const RADIUS = 22;

const DraggablePlayer: React.FC<DraggablePlayerProps> = ({
  player,
  selected,
  onSelect,
  onMove,
  svgRef,
}) => {
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const getSVGPoint = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      const svgP = pt.matrixTransform(ctm.inverse());
      return { x: svgP.x, y: svgP.y };
    },
    [svgRef]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);
      const pt = getSVGPoint(e.clientX, e.clientY);
      offset.current = { x: pt.x - player.x, y: pt.y - player.y };
      setDragging(true);
      onSelect(player.id);
    },
    [getSVGPoint, player.x, player.y, player.id, onSelect]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const pt = getSVGPoint(e.clientX, e.clientY);
      onMove(player.id, pt.x - offset.current.x, pt.y - offset.current.y);
    },
    [dragging, getSVGPoint, player.id, onMove]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  const teamColor =
    player.team === "home" ? "hsl(210, 90%, 55%)" : "hsl(0, 80%, 55%)";
  const glowColor =
    player.team === "home" ? "hsl(210, 90%, 65%)" : "hsl(0, 80%, 65%)";

  return (
    <g
      style={{ cursor: dragging ? "grabbing" : "grab" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Selection ring */}
      {selected && (
        <circle
          cx={player.x}
          cy={player.y}
          r={RADIUS + 6}
          fill="none"
          stroke="hsl(38, 95%, 55%)"
          strokeWidth={3}
          opacity={0.9}
        >
          <animate attributeName="r" values={`${RADIUS + 5};${RADIUS + 9};${RADIUS + 5}`} dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Shadow */}
      <ellipse
        cx={player.x + 2}
        cy={player.y + 3}
        rx={RADIUS}
        ry={RADIUS * 0.7}
        fill="rgba(0,0,0,0.3)"
      />

      {/* Player disc */}
      <circle
        cx={player.x}
        cy={player.y}
        r={RADIUS}
        fill={teamColor}
        stroke={selected ? "hsl(38, 95%, 55%)" : glowColor}
        strokeWidth={selected ? 3 : 2}
      />

      {/* Jersey number */}
      <text
        x={player.x}
        y={player.y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill="hsl(0, 0%, 100%)"
        fontSize={14}
        fontWeight={700}
        fontFamily="'Inter', sans-serif"
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {player.number}
      </text>

      {/* Label below */}
      {player.label && (
        <text
          x={player.x}
          y={player.y + RADIUS + 14}
          textAnchor="middle"
          fill="hsl(0, 0%, 85%)"
          fontSize={10}
          fontWeight={500}
          fontFamily="'Inter', sans-serif"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {player.label}
        </text>
      )}
    </g>
  );
};

export default DraggablePlayer;
