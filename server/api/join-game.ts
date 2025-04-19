import { arrayUnion } from "firebase/firestore";
import {
  getGameFromDatabase,
  updateGameInDatabase,
} from "~/server/utilities/firebase";
import { isValidFirebaseDocumentId, sanitizeName } from "~/utilities/sanitise";

export default defineEventHandler(async (event) => {
  const { playerName, gameId } = await readBody(event);
  const sanitizedName = sanitizeName(playerName);

  // All ids should be valid
  if (!sanitizedName || !isValidFirebaseDocumentId(gameId)) {
    throw new Error("Invalid input.");
  }

  // Check if game exists
  const existingGame = await getGameFromDatabase(gameId);

  if (!existingGame) {
    throw new Error("While joining game, game was not found.");
  }

  if (existingGame.players.length >= 2) {
    throw new Error("Can't join game, there are already two players.");
  }

  // Join game
  const playerId = crypto.randomUUID();
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
