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

  const playerActiveDice = gameData.dice_list.filter(
    (dice) => dice.player_id === playerId && dice.status === "active",
  );
  const targetRack = playerActiveDice.filter(
    (dice) => dice.rack === rackNumber,
  );

  // Chosen rack should not be full
  if (targetRack.length >= 3) {
    return false;
  }

  return true;
};

export const isGameReady = (game: GameData): boolean => {
  return false; //todo
};
