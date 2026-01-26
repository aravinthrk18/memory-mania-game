import { useState, useEffect, useCallback } from "react";
import GameCard from "./GameCard";
import GameStats from "./GameStats";
import WinModal from "./WinModal";
import { Difficulty, DIFFICULTY_CONFIG } from "./DifficultySelect";

// Available emojis for the game - we'll pick from these based on difficulty
const AVAILABLE_EMOJIS = ['🐶', '🐱', '🐼', '🦊', '🦁', '🐸', '🐵', '🐷', '🦄', '🐙', '🦋', '🌸'];

// Card type definition
interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameBoardProps {
  difficulty: Difficulty;
  onBack: () => void;
}

/**
 * Fisher-Yates shuffle algorithm
 * Randomly shuffles an array in place
 */
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * GameBoard Component
 * Main game logic and rendering
 */
const GameBoard = ({ difficulty, onBack }: GameBoardProps) => {
  const config = DIFFICULTY_CONFIG[difficulty];
  
  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  /**
   * Initialize the game board
   * Creates pairs of cards and shuffles them
   */
  const initializeGame = useCallback(() => {
    // Pick emojis based on difficulty (number of pairs needed)
    const gameEmojis = AVAILABLE_EMOJIS.slice(0, config.pairs);
    
    // Duplicate each emoji to create pairs
    const cardPairs = [...gameEmojis, ...gameEmojis];
    
    // Shuffle the cards
    const shuffledCards = shuffleArray(cardPairs);
    
    // Create card objects with unique IDs
    const newCards: Card[] = shuffledCards.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false
    }));

    // Reset all game state
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsChecking(false);
    setGameWon(false);
    setTime(0);
    setIsTimerRunning(false);
  }, [config.pairs]);

  // Initialize game on mount and difficulty change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer effect - runs every second when game is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && !gameWon) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, gameWon]);

  // Check for win condition
  useEffect(() => {
    if (matchedPairs === config.pairs && matchedPairs > 0) {
      setGameWon(true);
      setIsTimerRunning(false);
    }
  }, [matchedPairs, config.pairs]);

  /**
   * Handle card click
   * Flips the card and checks for matches
   */
  const handleCardClick = (cardId: number) => {
    // Ignore clicks while checking or if already 2 cards flipped
    if (isChecking || flippedCards.length >= 2) return;
    
    // Start timer on first card flip
    if (!isTimerRunning && moves === 0 && flippedCards.length === 0) {
      setIsTimerRunning(true);
    }

    // Find the clicked card
    const clickedCard = cards.find((card) => card.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    // Flip the card
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // If two cards are flipped, check for match
    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      setIsChecking(true);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found! Mark cards as matched
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
          setIsChecking(false);
        }, 300);
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 800);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          🧠 Memory Game
        </h1>
        <p className="text-muted-foreground">
          {config.label} Mode • {config.description}
        </p>
      </div>

      {/* Game Stats */}
      <GameStats
        moves={moves}
        time={time}
        matchedPairs={matchedPairs}
        difficulty={difficulty}
        onRestart={initializeGame}
      />

      {/* Game Grid */}
      <div
        className="grid gap-3 md:gap-4 w-full max-w-lg"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, 1fr)`
        }}
      >
        {cards.map((card) => (
          <GameCard
            key={card.id}
            emoji={card.emoji}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => handleCardClick(card.id)}
            disabled={isChecking}
          />
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="mt-8 text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Change Difficulty
      </button>

      {/* Win Modal */}
      {gameWon && (
        <WinModal
          moves={moves}
          time={time}
          difficulty={difficulty}
          onRestart={initializeGame}
          onChangeDifficulty={onBack}
        />
      )}
    </div>
  );
};

export default GameBoard;
