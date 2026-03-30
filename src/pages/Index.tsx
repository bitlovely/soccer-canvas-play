import TacticsBoard from "@/components/TacticsBoard";

const Index = () => {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚽</span>
            <div>
              <h1 className="text-lg font-extrabold text-foreground tracking-tight">
                TacticFlow
              </h1>
              <p className="text-xs text-muted-foreground">Interactive Soccer Tactics</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wider">
            MVP
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 min-h-0">
        <TacticsBoard />
      </main>
    </div>
  );
};

export default Index;
