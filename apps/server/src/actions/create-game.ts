import {
  GameData,
  ResultCreateGameData,
  SendCreateGameData,
} from "@knucklebones/shared/types.js";
import { sanitizeName } from "@knucklebones/shared/utilities/sanitise.js";
import { createGameInDatabase } from "~/utilities/firebase.js";
import { generateId, isValidCryptoId } from "~/utilities/generate-id.js";
import { rollDie } from "~/utilities/roll-die.js";

export const actionCreateGame = async ({
  playerName,
  playerId: providedPlayerId,
  playerSecretId: providedPlayerSecretId,
}: SendCreateGameData): Promise<ResultCreateGameData> => {
  const sanitizedName = sanitizeName(playerName).trim();

  if (!sanitizedName) {
    throw new Error("No valid name was supplied");
  }

  // If player already has id, verify
  if (providedPlayerId && !isValidCryptoId(providedPlayerId)) {
    throw new Error("Player id not valid");
  }

  // If player already has secret id, verify
  if (providedPlayerSecretId && !isValidCryptoId(providedPlayerSecretId)) {
    throw new Error("Player id not valid");
  }

  // Create game
  console.log("creating game");
  const playerId = providedPlayerId || generateId();
  const playerSecretId = providedPlayerSecretId || generateId();

  const newGameData: GameData = {
    created: new Date().toISOString(),
    version: 1,
    players: [
      {
        host: true,
        id: playerId,
        name: sanitizedName,
        dice: [],
        score: 0,
      },
    ],
    active_player: "",
    status: "lobby",
    winner: [],
    new_die: rollDie(),
    secrets: [{ id: playerId, secret: playerSecretId }],
    rematch_id: null,
  };

  // Push to database
  const gameId = await createGameInDatabase(newGameData);

  if (!gameId) {
    throw new Error("Something went wrong during game creation");
  }

  return {
    playerId,
    playerSecretId,
    gameId,
  };
};
