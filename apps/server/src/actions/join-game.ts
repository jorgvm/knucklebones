import { sanitizeName } from "@knucklebones/shared";
import type { GameId, Player, PlayerName } from "@knucklebones/shared/types.js";
import { isValidFirebaseDocumentId } from "@knucklebones/shared/utilities/sanitise.js";
import { arrayUnion } from "firebase/firestore";
import {
  getGameFromDatabase,
  updateGameInDatabase,
} from "~/utilities/firebase.js";
import { generateId } from "~/utilities/generate-id.js";

export const actionJoinGame = async ({
  playerName,
  gameId,
}: {
  playerName: PlayerName;
  gameId: GameId;
}): Promise<{ playerId: string }> => {
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
    score: 0,
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
};
