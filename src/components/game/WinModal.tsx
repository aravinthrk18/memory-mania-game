import { useEffect, useState } from "react";
import { Difficulty, DIFFICULTY_CONFIG } from "./DifficultySelect";

interface WinModalProps {
  moves: number;
  time: number;
  difficulty: Difficulty;
  onRestart: () => void;
  onChangeDifficulty: () => void;
}

/**
 * WinModal Component
 * Displays celebration screen when player wins
 */
const WinModal = ({ moves, time, difficulty, onRestart, onChangeDifficulty }: WinModalProps) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; color: string; delay: number }>>([]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate confetti pieces on mount
  useEffect(() => {
    const colors = ['#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2
    }));
    setConfetti(pieces);
  }, []);

  // Calculate rating based on performance
  const getRating = (): { stars: number; message: string } => {
    const pairs = DIFFICULTY_CONFIG[difficulty].pairs;
    const perfectMoves = pairs; // Best case: one move per pair
    const ratio = moves / perfectMoves;

    if (ratio <= 1.5) return { stars: 3, message: "Perfect! 🌟" };
    if (ratio <= 2.5) return { stars: 2, message: "Great job! ⭐" };
    return { stars: 1, message: "Good effort! 👍" };
  };

  const rating = getRating();

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

      {/* Win Content */}
      <div className="win-content max-w-md mx-4">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-4xl font-bold text-card-foreground mb-2">You Win!</h2>
        <p className="text-xl text-muted-foreground mb-6">{rating.message}</p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className={`text-4xl ${star <= rating.stars ? 'opacity-100' : 'opacity-30'}`}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="text-sm text-muted-foreground">Moves</div>
            <div className="text-3xl font-bold text-card-foreground">{moves}</div>
          </div>
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="text-sm text-muted-foreground">Time</div>
            <div className="text-3xl font-bold text-card-foreground">{formatTime(time)}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button onClick={onRestart} className="restart-btn">
            Play Again 🔄
          </button>
          <button
            onClick={onChangeDifficulty}
            className="px-6 py-3 rounded-xl font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Change Difficulty
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;
