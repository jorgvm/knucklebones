import type { PlayerId, GameData } from "~/utilities/types";

/**
 * Check if move is allowed
 */
export const moveIsAllowed = (
  playerId: PlayerId,
  gameData: GameData,
  rackNumber: number,
): boolean => {
  // Should be this player's turn
  if (playerId !== gameData.active_player) {
    return false;
  }

  // Should be active game
  if (gameData.status !== "playing") {
    return false;
  }

  // Player data should exist
  const activePlayer = gameData.players.find((i) => i.id === playerId);
  if (!activePlayer) {
    return false;
  }

  // Chosen rack should not be full
  const playerActiveDice = activePlayer.dice.filter(
    (dice) => dice.status === "active",
  );
  const diceInTargetRack = playerActiveDice.filter(
    (dice) => dice.rack === rackNumber,
  );

  if (diceInTargetRack.length >= 3) {
    return false;
  }

  // Move is allowed
  return true;
};
