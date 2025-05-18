import type {
  Player,
  ResultJoinGameData,
  SendJoinGameData,
} from "@knucklebones/shared/types.js";
import {
  isValidFirebaseDocumentId,
  sanitizeName,
} from "@knucklebones/shared/utilities/sanitise.js";
import { arrayUnion } from "firebase/firestore";

import {
  getGameFromDatabase,
  updateGameInDatabase,
} from "~/utilities/firebase.js";
import { generateId, isValidCryptoId } from "~/utilities/generate-id.js";
import { randomIntBetween } from "~/utilities/random-int-between.js";

export const actionJoinGame = async ({
  playerName,
  gameId,
  playerId: providedPlayerId,
  playerSecretId: providedPlayerSecretId,
}: SendJoinGameData): Promise<ResultJoinGameData> => {
  const sanitizedName = sanitizeName(playerName);

  // All ids should be valid
  if (!sanitizedName || !isValidFirebaseDocumentId(gameId)) {
    throw new Error("Invalid input.");
  }

  // If player already has id, verify
  if (providedPlayerId && !isValidCryptoId(providedPlayerId)) {
    throw new Error("Player id not valid");
  }

  // If player already has secret id, verify
  if (providedPlayerSecretId && !isValidCryptoId(providedPlayerSecretId)) {
    throw new Error("Player id not valid");
  }

  // Check if game exists
  const gameData = await getGameFromDatabase(gameId);

  if (!gameData) {
    throw new Error("While joining game, game was not found.");
  }

  if (gameData.players.length > 1) {
    throw new Error("Can't join game, there are already two players.");
  }

  // Create new player
  const playerId = providedPlayerId || generateId();
  const playerSecretId = providedPlayerSecretId || generateId();

  const newPlayer: Player = {
    host: false,
    dice: [],
    id: playerId,
    score: 0,
    name: sanitizedName,
  };

  const newPlayerSecret = { id: playerId, secret: playerSecretId };

  // Randomize which player gets to play first
  const players = [gameData.players[0].id, playerId];
  const newActivePlayer = players[randomIntBetween(0, 1)];

  // Join game
  await updateGameInDatabase(gameId, {
    players: arrayUnion(newPlayer),
    active_player: newActivePlayer,
    status: "playing",
    secrets: arrayUnion(newPlayerSecret),
  });

  return {
    playerId,
    playerSecretId,
  };
};
