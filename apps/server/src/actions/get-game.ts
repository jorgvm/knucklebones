import { getGameFromDatabase } from "~/utilities/firebase.js";
import type { GameData, GameId, PlayerId } from "@knucklebones/shared/types.js";
import { isValidFirebaseDocumentId } from "@knucklebones/shared/utilities/sanitise.js";
import { isValidCryptoId } from "~/utilities/generate-id.js";

export const actionGetGame = async ({
  gameId,
}: {
  gameId: GameId;
}): Promise<Partial<GameData>> => {
  // Validate input. playerId can be empty.

  if (!isValidFirebaseDocumentId(gameId)) {
    throw new Error("Game not found");
  }

  // Get game from database
  const gameData = (await getGameFromDatabase(gameId)) as GameData;

  if (!gameData) {
    throw new Error("Game not found");
  }

  // Define which data is public, to prevent accidential leak
  const publicGameData: Partial<GameData> = {
    players: gameData.players,
    active_player: gameData.active_player,
    new_die: gameData.new_die,
    winner: gameData.winner,
    status: gameData.status,
    version: gameData.version,
    secrets: [], // never send
  };

  return publicGameData;
};
