import { arrayUnion } from "firebase/firestore";
import {
  getGameFromDatabase,
  updateGameInDatabase,
} from "~/utilities/firebase";
import { generateId } from "~/utilities/generate-id";
import { isValidFirebaseDocumentId, sanitizeName } from "~/utilities/sanitise";

export default defineEventHandler(async (event) => {
  const { playerName, gameId } = await readBody(event);
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

  // Join game
  const playerId = generateId();
  const newPlayer = {
    host: false,
    id: playerId,
    name: sanitizedName,
  };

  await updateGameInDatabase(gameId, {
    players: arrayUnion(newPlayer),
    status: "playing",
  });

  return {
    playerId,
  };
});
