import { Difficulty, DIFFICULTY_CONFIG } from "./DifficultySelect";

interface GameStatsProps {
  moves: number;
  time: number;
  matchedPairs: number;
  difficulty: Difficulty;
  onRestart: () => void;
}

/**
 * GameStats Component
 * Displays current game statistics (moves, time, progress)
 */
const GameStats = ({ moves, time, matchedPairs, difficulty, onRestart }: GameStatsProps) => {
  const totalPairs = DIFFICULTY_CONFIG[difficulty].pairs;
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
      {/* Moves Counter */}
      <div className="stats-card">
        <div className="text-sm text-muted-foreground">Moves</div>
        <div className="text-2xl font-bold text-foreground">{moves}</div>
      </div>

      {/* Timer */}
      <div className="stats-card">
        <div className="text-sm text-muted-foreground">Time</div>
        <div className="text-2xl font-bold text-foreground">{formatTime(time)}</div>
      </div>

      {/* Progress */}
      <div className="stats-card">
        <div className="text-sm text-muted-foreground">Pairs</div>
        <div className="text-2xl font-bold text-foreground">
          {matchedPairs}/{totalPairs}
        </div>
      </div>

      {/* Restart Button */}
      <button
        onClick={onRestart}
        className="stats-card hover:bg-muted/70 transition-colors cursor-pointer"
        aria-label="Restart game"
      >
        <span className="text-2xl">🔄</span>
      </button>
    </div>
  );
};

export default GameStats;
