import { useState, useEffect } from "react";
import GameCard from "./GameCard";
import GameStats from "./GameStats";
import WinModal from "./WinModal";
import { Difficulty, DIFFICULTY_CONFIG } from "./DifficultySelect";

// All the emojis we can use in the game
const ALL_EMOJIS = ['🐶', '🐱', '🐼', '🦊', '🦁', '🐸', '🐵', '🐷', '🦄', '🐙', '🦋', '🌸'];

// What a card looks like in our game
interface Card {
  id: number;          // Unique number for this card
  emoji: string;       // The emoji on this card
  isFlipped: boolean;  // Is it face-up?
  isMatched: boolean;  // Has it been matched?
}

interface GameBoardProps {
  difficulty: Difficulty;  // Easy, medium, or hard
  onBack: () => void;      // Go back to difficulty select
}

/**
 * Shuffle an array randomly (Fisher-Yates algorithm)
 * This mixes up the cards so they're in random order
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
 * This is where the actual game happens
 */
const GameBoard = ({ difficulty, onBack }: GameBoardProps) => {
  // Get the settings for current difficulty
  const config = DIFFICULTY_CONFIG[difficulty];
  
  // === GAME STATE ===
  const [cards, setCards] = useState<Card[]>([]);              // All the cards
  const [firstCard, setFirstCard] = useState<number | null>(null);   // ID of first flipped card
  const [secondCard, setSecondCard] = useState<number | null>(null); // ID of second flipped card
  const [moves, setMoves] = useState(0);                       // How many moves taken
  const [matchedPairs, setMatchedPairs] = useState(0);         // How many pairs found
  const [isLocked, setIsLocked] = useState(false);             // Prevent clicking during check
  const [shakingCards, setShakingCards] = useState<number[]>([]); // Cards that are shaking
  const [gameWon, setGameWon] = useState(false);               // Did player win?
  const [time, setTime] = useState(0);                         // Timer in seconds
  const [gameStarted, setGameStarted] = useState(false);       // Has player made first move?

  /**
   * Set up a new game
   * Creates cards, shuffles them, and resets everything
   */
  const setupNewGame = () => {
    // Pick the right number of emojis for this difficulty
    const gameEmojis = ALL_EMOJIS.slice(0, config.pairs);
    
    // Create pairs (each emoji appears twice)
    const cardPairs = [...gameEmojis, ...gameEmojis];
    
    // Shuffle the cards randomly
    const shuffledCards = shuffleArray(cardPairs);
    
    // Create card objects with IDs
    const newCards: Card[] = shuffledCards.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false
    }));

    // Reset all game state
    setCards(newCards);
    setFirstCard(null);
    setSecondCard(null);
    setMoves(0);
    setMatchedPairs(0);
    setIsLocked(false);
    setShakingCards([]);
    setGameWon(false);
    setTime(0);
    setGameStarted(false);
  };

  // Set up game when component loads or difficulty changes
  useEffect(() => {
    setupNewGame();
  }, [difficulty]);

  // Timer - counts up every second while playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameStarted && !gameWon) {
      timer = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }

    // Clean up timer when component unmounts
    return () => clearInterval(timer);
  }, [gameStarted, gameWon]);

  // Check for win condition
  useEffect(() => {
    if (matchedPairs === config.pairs && matchedPairs > 0) {
      // Player found all pairs - they win!
      setGameWon(true);
    }
  }, [matchedPairs, config.pairs]);

  /**
   * Check if the two flipped cards match
   */
  const checkForMatch = (firstId: number, secondId: number) => {
    const card1 = cards.find(c => c.id === firstId);
    const card2 = cards.find(c => c.id === secondId);

    if (card1 && card2 && card1.emoji === card2.emoji) {
      // === MATCH! ===
      // Mark cards as matched after a short delay
      setTimeout(() => {
        setCards(prev => prev.map(card => 
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card
        ));
        setMatchedPairs(prev => prev + 1);
        
        // Reset for next turn
        setFirstCard(null);
        setSecondCard(null);
        setIsLocked(false);
      }, 400);
    } else {
      // === NO MATCH ===
      // Shake the cards to show mismatch
      setShakingCards([firstId, secondId]);
      
      // Flip cards back after delay
      setTimeout(() => {
        setCards(prev => prev.map(card =>
          card.id === firstId || card.id === secondId
            ? { ...card, isFlipped: false }
            : card
        ));
        setShakingCards([]);
        
        // Reset for next turn
        setFirstCard(null);
        setSecondCard(null);
        setIsLocked(false);
      }, 1000);
    }
  };

  /**
   * Handle when a card is clicked
   */
  const handleCardClick = (cardId: number) => {
    // Ignore clicks if locked or already have 2 cards flipped
    if (isLocked) return;
    
    // Find the clicked card
    const clickedCard = cards.find(c => c.id === cardId);
    
    // Ignore if card is already flipped or matched
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;
    
    // Ignore if clicking the same card that's already selected
    if (cardId === firstCard) return;

    // Start the timer on first card flip
    if (!gameStarted) {
      setGameStarted(true);
    }

    // Flip this card face-up
    setCards(prev => prev.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    if (firstCard === null) {
      // This is the first card of the pair
      setFirstCard(cardId);
    } else {
      // This is the second card - check for match
      setSecondCard(cardId);
      setIsLocked(true);  // Lock the board while checking
      setMoves(prev => prev + 1);  // Count this as one move
      
      // Check if cards match
      checkForMatch(firstCard, cardId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Game Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          🧠 Memory Game
        </h1>
        <p className="text-muted-foreground">
          {config.label} Mode • Find all {config.pairs} pairs!
        </p>
      </div>

      {/* Stats Bar (moves, time, progress, restart) */}
      <GameStats
        moves={moves}
        time={time}
        matchedPairs={matchedPairs}
        difficulty={difficulty}
        onRestart={setupNewGame}
      />

      {/* The Card Grid */}
      <div
        className="grid gap-2 md:gap-3 w-full max-w-md"
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
            isShaking={shakingCards.includes(card.id)}
            onClick={() => handleCardClick(card.id)}
            disabled={isLocked}
          />
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="mt-8 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors underline"
      >
        ← Change Difficulty
      </button>

      {/* Win Screen */}
      {gameWon && (
        <WinModal
          moves={moves}
          time={time}
          difficulty={difficulty}
          onRestart={setupNewGame}
          onChangeDifficulty={onBack}
        />
      )}
    </div>
  );
};

export default GameBoard;
