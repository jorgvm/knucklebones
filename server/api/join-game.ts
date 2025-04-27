import { arrayUnion } from "firebase/firestore";
import {
  getGameFromDatabase,
  updateGameInDatabase,
} from "~/utilities/firebase";
import { generateId } from "~/utilities/generate-id";
import { isValidFirebaseDocumentId, sanitizeName } from "~/utilities/sanitise";
import type { Player } from "~/utilities/types";

export default defineEventHandler(async (event) => {
  const { playerName, gameId }: { playerName: string; gameId: string } =
    await readBody(event);
  const sanitizedName = sanitizeName(playerName);

  // All ids should be valid
  if (!sanitizedName || !isValidFirebaseDocumentId(gameId)) {
    throw new Error("Invalid input.");
  }

  // Check if game exists
  const gameData = await getGameFromDatabase(gameId);
  if (!gameData) {
    throw new Error("While joining game, game was not found.");
  }
  if (gameData.players.length >= 2) {
    throw new Error("Can't join game, there are already two players.");
  }

  // Create new player
  const playerId = generateId();
  const newPlayer: Player = {
    host: false,
    dice: [],
    id: playerId,
    name: sanitizedName,
  };

  // Join game
  await updateGameInDatabase(gameId, {
    players: arrayUnion(newPlayer),
    status: "playing",
  });

  return {
    playerId,
  };
});
