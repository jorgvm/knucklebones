import type { PlayerId, GameStatus, Player } from "@shared/types";

/**
 * Check if move is allowed
 */
export const moveIsAllowed = ({
  activePlayer,
  gameActivePlayerId,
  gameStatus,
  rackNumber,
}: {
  activePlayer: Player;
  gameActivePlayerId: PlayerId | null;
  gameStatus: GameStatus;
  rackNumber: number;
}): boolean => {
  // Player data should exist
  if (!activePlayer) {
    return false;
  }

  // Should be this player's turn
  if (activePlayer.id !== gameActivePlayerId) {
    return false;
  }

  // Should be active game
  if (gameStatus !== "playing") {
    return false;
  }

  // Chosen rack should not be full
  const playerActiveDice = activePlayer.dice.filter(
    (die) => die.status === "active",
  );
  const diceInTargetRack = playerActiveDice.filter(
    (die) => die.rack === rackNumber,
  );

  if (diceInTargetRack.length >= 3) {
    return false;
  }

  // Move is allowed
  return true;
};
