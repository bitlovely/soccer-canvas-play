import React, { useCallback, useRef, useState } from "react";
import { SoccerField, SVG_W, SVG_H, PADDING, FIELD_WIDTH, FIELD_HEIGHT } from "./SoccerField";
import DraggablePlayer, { Player } from "./DraggablePlayer";

const CX = PADDING + FIELD_WIDTH / 2;

function create11v11(): Player[] {
  const left = PADDING + 80;
  const right = PADDING + FIELD_WIDTH - 80;
  const yTop = PADDING + 70;
  const yBottom = PADDING + FIELD_HEIGHT - 70;

  const xL = CX - 240;
  const xR = CX + 240;
  const xML = CX - 140;
  const xMR = CX + 140;

  const home: Omit<Player, "id">[] = [
    // 4-3-3 (home attacks "down" the original field)
    { x: CX, y: yTop, number: 1, team: "home", label: "GK" },
    { x: xL, y: PADDING + 260, number: 2, team: "home", label: "RB" },
    { x: xML, y: PADDING + 240, number: 4, team: "home", label: "CB" },
    { x: xMR, y: PADDING + 240, number: 5, team: "home", label: "CB" },
    { x: xR, y: PADDING + 260, number: 3, team: "home", label: "LB" },
    { x: xML, y: PADDING + 470, number: 6, team: "home", label: "DM" },
    { x: CX, y: PADDING + 520, number: 8, team: "home", label: "CM" },
    { x: xMR, y: PADDING + 470, number: 10, team: "home", label: "AM" },
    { x: xL, y: PADDING + 720, number: 7, team: "home", label: "RW" },
    { x: CX, y: PADDING + 780, number: 9, team: "home", label: "ST" },
    { x: xR, y: PADDING + 720, number: 11, team: "home", label: "LW" },
  ];

  const away: Omit<Player, "id">[] = [
    // mirrored 4-3-3 (away attacks "up" the original field)
    { x: CX, y: yBottom, number: 1, team: "away", label: "GK" },
    { x: xL, y: PADDING + FIELD_HEIGHT - 260, number: 2, team: "away", label: "RB" },
    { x: xML, y: PADDING + FIELD_HEIGHT - 240, number: 4, team: "away", label: "CB" },
    { x: xMR, y: PADDING + FIELD_HEIGHT - 240, number: 5, team: "away", label: "CB" },
    { x: xR, y: PADDING + FIELD_HEIGHT - 260, number: 3, team: "away", label: "LB" },
    { x: xML, y: PADDING + FIELD_HEIGHT - 470, number: 6, team: "away", label: "DM" },
    { x: CX, y: PADDING + FIELD_HEIGHT - 520, number: 8, team: "away", label: "CM" },
    { x: xMR, y: PADDING + FIELD_HEIGHT - 470, number: 10, team: "away", label: "AM" },
    { x: xL, y: PADDING + FIELD_HEIGHT - 720, number: 7, team: "away", label: "RW" },
    { x: CX, y: PADDING + FIELD_HEIGHT - 780, number: 9, team: "away", label: "ST" },
    { x: xR, y: PADDING + FIELD_HEIGHT - 720, number: 11, team: "away", label: "LW" },
  ];

  return [...home, ...away].map((p, i) => ({ id: i + 1, ...p }));
}

const initialPlayers: Player[] = create11v11();

const TacticsBoard: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleMove = useCallback((id: number, x: number, y: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, x, y } : p))
    );
  }, []);

  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const handleDeselect = useCallback(() => {
    setSelectedId(null);
  }, []);

  const handleReset = useCallback(() => {
    setPlayers(initialPlayers);
    setSelectedId(null);
  }, []);

  const selectedPlayer = players.find((p) => p.id === selectedId);

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full h-full p-3 sm:p-4 lg:p-6">
      {/* Field */}
      <div className="flex-1 min-w-0 min-h-0">
        <div className="h-full rounded-xl overflow-hidden border border-border bg-card shadow-2xl">
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <svg
            ref={svgRef as React.RefObject<SVGSVGElement>}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="max-w-full max-h-full w-auto h-auto rotate-90"
            style={{ touchAction: "none" }}
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) handleDeselect();
            }}
          >
            {/* Background */}
            <rect width={SVG_W} height={SVG_H} fill="hsl(140, 40%, 18%)" rx={8} />

            <SoccerField />

            {/* Render players — selected last for z-order */}
            {players
              .filter((p) => p.id !== selectedId)
              .map((p) => (
                <DraggablePlayer
                  key={p.id}
                  player={p}
                  selected={false}
                  onSelect={handleSelect}
                  onMove={handleMove}
                  svgRef={svgRef as React.RefObject<SVGSVGElement>}
                />
              ))}
            {selectedPlayer && (
              <DraggablePlayer
                player={selectedPlayer}
                selected={true}
                onSelect={handleSelect}
                onMove={handleMove}
                svgRef={svgRef as React.RefObject<SVGSVGElement>}
              />
            )}
          </svg>
          </div>
        </div>
      </div>

      {/* Side panel */}
      <div className="w-full lg:w-80 flex flex-col gap-4 lg:max-h-full lg:overflow-auto">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold text-foreground mb-1">⚽ Tactics Board</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Drag players to position them. Click to select & highlight.
          </p>

          <button
            onClick={handleReset}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors"
          >
            Reset Positions
          </button>
        </div>

        {/* Selected player info */}
        {selectedPlayer && (
          <div className="rounded-xl border border-border bg-card p-5 animate-in fade-in slide-in-from-top-2 duration-200">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Selected Player
            </h3>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor:
                    selectedPlayer.team === "home"
                      ? "hsl(210, 90%, 55%)"
                      : "hsl(0, 80%, 55%)",
                  color: "white",
                }}
              >
                {selectedPlayer.number}
              </div>
              <div>
                <p className="text-foreground font-semibold">
                  #{selectedPlayer.number} — {selectedPlayer.label || "Player"}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {selectedPlayer.team} team
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground font-mono">
              Position: ({Math.round(selectedPlayer.x)}, {Math.round(selectedPlayer.y)})
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Teams
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(210, 90%, 55%)" }} />
              <span className="text-sm text-foreground">Home Team</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(0, 80%, 55%)" }} />
              <span className="text-sm text-foreground">Away Team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TacticsBoard;
