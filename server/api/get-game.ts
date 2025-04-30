import { getGameFromDatabase } from "~/utilities/firebase";
import { isValidCryptoId } from "~/utilities/generate-id";
import { removeOpponentId } from "~/utilities/remove-opponent-id";
import { isValidFirebaseDocumentId } from "~/utilities/sanitise";
import type { GameData } from "~/utilities/types";

export default defineEventHandler(async (event) => {
  const { gameId, playerId } = await readBody(event);

  // Validate input. playerId can be empty.
  const playerIdIsValid = !playerId || isValidCryptoId(playerId);
  if (!playerIdIsValid || !isValidFirebaseDocumentId(gameId)) {
    throw new Error("Game not found");
  }

  // Get game from database
  const gameData = (await getGameFromDatabase(gameId)) as GameData;

  if (!gameData) {
    throw new Error("Game not found");
  }

  // Remove opponent id to prevent cheating
  const opponent = gameData.players.find((player) => player.id !== playerId);
  if (gameData.players.length > 1 && !opponent?.id) {
    throw new Error("There is more than 1 player, but no opponent id");
  }
  const cleanedGameData = removeOpponentId(gameData, opponent?.id);

  // Define which data is public, to prevent accidential leak
  const publicGameData: Partial<GameData> = {
    players: cleanedGameData.players,
    active_player: cleanedGameData.active_player,
    new_die: cleanedGameData.new_die,
    winner: cleanedGameData.winner,
    status: cleanedGameData.status,
    version: cleanedGameData.version,
  };

  return publicGameData;
});
