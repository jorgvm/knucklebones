import { GameData } from "@knucklebones/shared/types.js";

/**
 * Remove information from gamedata we don't want to send to the players
 *
 */
export const toPublicGameData = (gameData: GameData): GameData => {
  return {
    ...gameData,
    secrets: [],
  };
};
