import { Difficulty, DIFFICULTY_CONFIG } from "./DifficultySelect";

interface GameStatsProps {
  moves: number;            // Number of moves taken
  time: number;             // Time in seconds
  matchedPairs: number;     // How many pairs found
  difficulty: Difficulty;   // Current difficulty
  onRestart: () => void;    // Restart the game
}

/**
 * GameStats Component
 * Shows the current game stats: moves, time, and progress
 */
const GameStats = ({ moves, time, matchedPairs, difficulty, onRestart }: GameStatsProps) => {
  const totalPairs = DIFFICULTY_CONFIG[difficulty].pairs;
  
  /**
   * Format seconds as MM:SS
   * Example: 125 seconds = "02:05"
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
      {/* Moves Counter */}
      <div className="stats-card text-center">
        <div className="text-xs text-muted-foreground">Moves</div>
        <div className="text-xl font-bold text-foreground">{moves}</div>
      </div>

      {/* Timer */}
      <div className="stats-card text-center">
        <div className="text-xs text-muted-foreground">Time</div>
        <div className="text-xl font-bold text-foreground">{formatTime(time)}</div>
      </div>

      {/* Pairs Found */}
      <div className="stats-card text-center">
        <div className="text-xs text-muted-foreground">Found</div>
        <div className="text-xl font-bold text-foreground">
          {matchedPairs}/{totalPairs}
        </div>
      </div>

      {/* Restart Button */}
      <button
        onClick={onRestart}
        className="stats-card hover:bg-muted/70 transition-colors cursor-pointer"
        aria-label="Restart game"
        title="Restart Game"
      >
        <span className="text-xl">🔄</span>
      </button>
    </div>
  );
};

export default GameStats;
