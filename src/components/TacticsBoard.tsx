import React, { useCallback, useRef, useState } from "react";
import { SoccerField, SVG_W, SVG_H, PADDING, FIELD_WIDTH, FIELD_HEIGHT } from "./SoccerField";
import DraggablePlayer, { Player } from "./DraggablePlayer";

const CX = PADDING + FIELD_WIDTH / 2;

const initialPlayers: Player[] = [
  // Home team (blue) — 4 players in a formation
  { id: 1, x: CX, y: PADDING + 50, number: 1, team: "home", label: "GK" },
  { id: 2, x: CX - 150, y: PADDING + 250, number: 4, team: "home", label: "CB" },
  { id: 3, x: CX + 150, y: PADDING + 250, number: 5, team: "home", label: "CB" },
  { id: 4, x: CX, y: PADDING + 420, number: 8, team: "home", label: "CM" },

  // Away team (red) — 4 players
  { id: 5, x: CX, y: PADDING + FIELD_HEIGHT - 50, number: 1, team: "away", label: "GK" },
  { id: 6, x: CX - 150, y: PADDING + FIELD_HEIGHT - 250, number: 4, team: "away", label: "CB" },
  { id: 7, x: CX + 150, y: PADDING + FIELD_HEIGHT - 250, number: 5, team: "away", label: "CB" },
  { id: 8, x: CX, y: PADDING + FIELD_HEIGHT - 420, number: 9, team: "away", label: "ST" },
];

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
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full max-w-7xl mx-auto p-4 lg:p-8">
      {/* Field */}
      <div className="flex-1 min-w-0">
        <div className="rounded-xl overflow-hidden border border-border bg-card shadow-2xl">
          <svg
            ref={svgRef as React.RefObject<SVGSVGElement>}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full h-auto"
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

      {/* Side panel */}
      <div className="w-full lg:w-72 flex flex-col gap-4">
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
