import { useEffect, useState } from "react";
import { Difficulty, DIFFICULTY_CONFIG } from "./DifficultySelect";

interface WinModalProps {
  moves: number;              // How many moves player took
  time: number;               // Time in seconds
  difficulty: Difficulty;     // Which difficulty was played
  onRestart: () => void;      // Play again at same difficulty
  onChangeDifficulty: () => void;  // Go back to difficulty select
}

/**
 * WinModal Component
 * Shows when player wins the game
 * Displays score and options to play again
 */
const WinModal = ({ moves, time, difficulty, onRestart, onChangeDifficulty }: WinModalProps) => {
  // State for confetti pieces
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; color: string; delay: number }>>([]);

  /**
   * Format seconds as MM:SS
   * Example: 65 seconds = "01:05"
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Create confetti when modal appears
  useEffect(() => {
    const colors = ['#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
    const pieces = [];
    
    // Create 30 confetti pieces
    for (let i = 0; i < 30; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,  // Random horizontal position
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2    // Random start delay
      });
    }
    
    setConfetti(pieces);
  }, []);

  /**
   * Calculate star rating based on how well player did
   * - 3 stars: Very few moves
   * - 2 stars: Decent number of moves
   * - 1 star: Took a while but finished!
   */
  const getStarRating = (): { stars: number; message: string } => {
    const pairs = DIFFICULTY_CONFIG[difficulty].pairs;
    const perfectMoves = pairs; // Best possible = 1 move per pair
    const ratio = moves / perfectMoves;

    if (ratio <= 1.5) {
      return { stars: 3, message: "Amazing! 🌟" };
    } else if (ratio <= 2.5) {
      return { stars: 2, message: "Great job! ⭐" };
    } else {
      return { stars: 1, message: "Good effort! 👍" };
    }
  };

  const rating = getStarRating();

  return (
    <div className="win-modal">
      {/* Confetti Animation */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece rounded-sm"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`
          }}
        />
      ))}

      {/* Win Message */}
      <div className="win-content max-w-sm mx-4">
        {/* Trophy emoji */}
        <div className="text-5xl mb-3">🎉</div>
        
        {/* You Win title */}
        <h2 className="text-3xl font-bold text-card-foreground mb-2">
          You Win!
        </h2>
        
        {/* Rating message */}
        <p className="text-lg text-muted-foreground mb-4">
          {rating.message}
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className={`text-3xl ${star <= rating.stars ? 'opacity-100' : 'opacity-30'}`}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Stats (moves and time) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-sm text-muted-foreground">Moves</div>
            <div className="text-2xl font-bold text-card-foreground">{moves}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-sm text-muted-foreground">Time</div>
            <div className="text-2xl font-bold text-card-foreground">{formatTime(time)}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button onClick={onRestart} className="restart-btn">
            Play Again 🔄
          </button>
          <button
            onClick={onChangeDifficulty}
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Change Difficulty
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;
