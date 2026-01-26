import { cn } from "@/lib/utils";

// Props for the GameCard component
interface GameCardProps {
  emoji: string;           // The emoji shown on the card
  isFlipped: boolean;      // Is the card currently face-up?
  isMatched: boolean;      // Has this card been matched?
  isShaking: boolean;      // Should card shake (mismatch feedback)?
  onClick: () => void;     // What happens when clicked
  disabled: boolean;       // Can the card be clicked?
}

/**
 * GameCard Component
 * Shows a single card that can be flipped
 * - Face down: shows "?" 
 * - Face up: shows the emoji
 */
const GameCard = ({ emoji, isFlipped, isMatched, isShaking, onClick, disabled }: GameCardProps) => {
  // Build the CSS class string based on card state
  const cardClasses = cn(
    "game-card aspect-square w-full",
    isFlipped && "flipped",
    isMatched && "matched",
    isShaking && "shake"
  );

  // Handle card click
  const handleClick = () => {
    // Only allow click if card is not already flipped/matched and clicks are enabled
    if (!isFlipped && !isMatched && !disabled) {
      onClick();
    }
  };

  // Handle keyboard accessibility (Enter or Space to flip)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role="button"
      aria-label={isFlipped || isMatched ? `Card showing ${emoji}` : "Hidden card"}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Inner container for the flip animation */}
      <div className="card-inner">
        {/* Front face - what you see when card is face down */}
        <div className="card-face card-front" />
        
        {/* Back face - shows the emoji when flipped */}
        <div className="card-face card-back">
          <span className="text-4xl md:text-5xl select-none">{emoji}</span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
