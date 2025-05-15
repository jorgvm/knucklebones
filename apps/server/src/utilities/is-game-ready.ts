import { getRacks } from "@knucklebones/shared/utilities/get-racks.js";
import type { GameData } from "@knucklebones/shared/types.js";

/**
 * Check if a player has a full board of 3*3 dice
 */
export const isGameReady = (gameData: GameData): boolean => {
  return gameData.players.some((player) => {
    const racks = getRacks(player.dice, true);

    return racks.every((rack) => rack.length === 3);
  });
};
