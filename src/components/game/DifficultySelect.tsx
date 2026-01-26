// Difficulty type definition
export type Difficulty = 'easy' | 'medium' | 'hard';

// Configuration for each difficulty level
export const DIFFICULTY_CONFIG = {
  easy: {
    pairs: 4,        // 4 pairs = 8 cards
    cols: 4,         // 4 columns
    rows: 2,         // 2 rows
    label: 'Easy',
    description: '4 pairs • 2×4 grid'
  },
  medium: {
    pairs: 6,        // 6 pairs = 12 cards
    cols: 4,         // 4 columns
    rows: 3,         // 3 rows
    label: 'Medium',
    description: '6 pairs • 3×4 grid'
  },
  hard: {
    pairs: 8,        // 8 pairs = 16 cards
    cols: 4,         // 4 columns
    rows: 4,         // 4 rows
    label: 'Hard',
    description: '8 pairs • 4×4 grid'
  }
} as const;

interface DifficultySelectProps {
  onSelect: (difficulty: Difficulty) => void;
}

/**
 * DifficultySelect Component
 * Displays difficulty selection screen before game starts
 */
const DifficultySelect = ({ onSelect }: DifficultySelectProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Game Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">
          🧠 Memory Game
        </h1>
        <p className="text-xl text-muted-foreground">
          Match all the pairs to win!
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Choose Difficulty
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Easy Button */}
          <button
            className="difficulty-btn difficulty-easy"
            onClick={() => onSelect('easy')}
          >
            <div className="text-2xl mb-1">🌱</div>
            <div>{DIFFICULTY_CONFIG.easy.label}</div>
            <div className="text-sm opacity-80">{DIFFICULTY_CONFIG.easy.description}</div>
          </button>

          {/* Medium Button */}
          <button
            className="difficulty-btn difficulty-medium"
            onClick={() => onSelect('medium')}
          >
            <div className="text-2xl mb-1">⚡</div>
            <div>{DIFFICULTY_CONFIG.medium.label}</div>
            <div className="text-sm opacity-80">{DIFFICULTY_CONFIG.medium.description}</div>
          </button>

          {/* Hard Button */}
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

      {/* Instructions */}
      <div className="text-center text-muted-foreground max-w-md">
        <p className="text-sm">
          Flip two cards at a time. Match all pairs with the fewest moves!
        </p>
      </div>
    </div>
  );
};

export default DifficultySelect;
