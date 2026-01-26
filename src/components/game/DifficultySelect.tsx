// Difficulty type - can only be one of these three values
export type Difficulty = 'easy' | 'medium' | 'hard';

// Settings for each difficulty level
export const DIFFICULTY_CONFIG = {
  easy: {
    pairs: 4,        // 4 pairs = 8 cards total
    cols: 4,         // 4 columns
    rows: 2,         // 2 rows
    label: 'Easy',
    description: '4 pairs'
  },
  medium: {
    pairs: 6,        // 6 pairs = 12 cards total
    cols: 4,         // 4 columns
    rows: 3,         // 3 rows
    label: 'Medium',
    description: '6 pairs'
  },
  hard: {
    pairs: 8,        // 8 pairs = 16 cards total
    cols: 4,         // 4 columns
    rows: 4,         // 4 rows
    label: 'Hard',
    description: '8 pairs'
  }
} as const;

interface DifficultySelectProps {
  onSelect: (difficulty: Difficulty) => void;  // Called when player picks a difficulty
}

/**
 * DifficultySelect Component
 * The first screen the player sees
 * Lets them choose Easy, Medium, or Hard
 */
const DifficultySelect = ({ onSelect }: DifficultySelectProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Game Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-3">
          🧠 Memory Game
        </h1>
        <p className="text-lg text-muted-foreground">
          Match all the pairs to win!
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-5">
          Choose Your Level
        </h2>
        
        {/* Three difficulty buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Easy */}
          <button
            className="difficulty-btn difficulty-easy"
            onClick={() => onSelect('easy')}
          >
            <div className="text-2xl mb-1">🌱</div>
            <div>{DIFFICULTY_CONFIG.easy.label}</div>
            <div className="text-sm opacity-80">{DIFFICULTY_CONFIG.easy.description}</div>
          </button>

          {/* Medium */}
          <button
            className="difficulty-btn difficulty-medium"
            onClick={() => onSelect('medium')}
          >
            <div className="text-2xl mb-1">⚡</div>
            <div>{DIFFICULTY_CONFIG.medium.label}</div>
            <div className="text-sm opacity-80">{DIFFICULTY_CONFIG.medium.description}</div>
          </button>

          {/* Hard */}
          <button
            className="difficulty-btn difficulty-hard"
            onClick={() => onSelect('hard')}
          >
            <div className="text-2xl mb-1">🔥</div>
            <div>{DIFFICULTY_CONFIG.hard.label}</div>
            <div className="text-sm opacity-80">{DIFFICULTY_CONFIG.hard.description}</div>
          </button>
        </div>
      </div>

      {/* How to Play */}
      <div className="text-center text-muted-foreground max-w-sm">
        <p className="text-sm">
          Flip two cards at a time. If they match, they stay open. 
          Find all pairs with the fewest moves!
        </p>
      </div>
    </div>
  );
};

export default DifficultySelect;
