import { getGameFromDatabase } from "~/utilities/firebase";
import { removeOpponentId } from "~/utilities/remove-opponent-id";
import {
  isValidFirebaseDocumentId,
  isValidCryptoId,
} from "~/utilities/sanitise";
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
  const publicGameData = removeOpponentId(gameData, opponent?.id);

  return publicGameData;
});
