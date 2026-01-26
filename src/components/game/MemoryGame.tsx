import { useState } from "react";
import DifficultySelect, { Difficulty } from "./DifficultySelect";
import GameBoard from "./GameBoard";

/**
 * MemoryGame Component
 * Main container that manages game state between difficulty selection and gameplay
 */
const MemoryGame = () => {
  // null = showing difficulty selection, otherwise = playing game
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  /**
   * Handle difficulty selection
   * Transitions from difficulty screen to game board
   */
  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  /**
   * Return to difficulty selection
   * Called when player wants to change difficulty
   */
  const handleBackToDifficulty = () => {
    setSelectedDifficulty(null);
  };

  // Show difficulty selection if no difficulty selected
  if (!selectedDifficulty) {
    return <DifficultySelect onSelect={handleSelectDifficulty} />;
  }

  // Show game board with selected difficulty
  return (
    <GameBoard
      difficulty={selectedDifficulty}
      onBack={handleBackToDifficulty}
    />
  );
};

export default MemoryGame;
