import { cn } from "@/lib/utils";

// Props interface for the GameCard component
interface GameCardProps {
  emoji: string;           // The emoji/icon to display on the card
  isFlipped: boolean;      // Whether the card is currently flipped
  isMatched: boolean;      // Whether the card has been matched
  onClick: () => void;     // Click handler
  disabled: boolean;       // Whether clicks are disabled
}

/**
 * GameCard Component
 * Represents a single card in the memory game with flip animation
 */
const GameCard = ({ emoji, isFlipped, isMatched, onClick, disabled }: GameCardProps) => {
  return (
    <div
      className={cn(
        "game-card aspect-square w-full",
        isFlipped && "flipped",
        isMatched && "matched"
      )}
      onClick={() => {
        // Only allow click if card is not already flipped, matched, or disabled
        if (!isFlipped && !isMatched && !disabled) {
          onClick();
        }
      }}
      role="button"
      aria-label={isFlipped || isMatched ? `Card showing ${emoji}` : "Hidden card"}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (!isFlipped && !isMatched && !disabled) {
            onClick();
          }
        }
      }}
    >
      {/* Inner container for 3D flip effect */}
      <div className="card-inner">
        {/* Front face (face down - question mark) */}
        <div className="card-face card-front" />
        
        {/* Back face (shows the emoji) */}
        <div className="card-face card-back">
          <span className="text-5xl md:text-6xl select-none">{emoji}</span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
