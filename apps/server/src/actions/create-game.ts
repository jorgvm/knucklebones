import {
  GameData,
  ResultCreateGameData,
  SendCreateGameData,
} from "@knucklebones/shared/types.js";
import { sanitizeName } from "@knucklebones/shared/utilities/sanitise.js";
import { createGameInDatabase } from "~/utilities/firebase.js";
import { generateId, isValidCryptoId } from "~/utilities/generate-id.js";
import { rollDie } from "~/utilities/roll-die.js";
import { botId, botSecretId } from "~/utilities/server-id.js";

export const actionCreateGame = async ({
  playerName,
  playerId: providedPlayerId,
  playerSecretId: providedPlayerSecretId,
  type,
}: SendCreateGameData): Promise<ResultCreateGameData> => {
  const sanitizedName = sanitizeName(playerName).trim();

  if (!sanitizedName) {
    throw new Error("No valid name was supplied");
  }

  if (!["singleplayer", "multiplayer"].includes(type)) {
    throw new Error("Invalid game type");
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
  const playerId = providedPlayerId || generateId();
  const playerSecretId = providedPlayerSecretId || generateId();

  let newGameData: GameData;

  if (type === "multiplayer") {
    newGameData = {
      active_player: "",
      created: new Date().toISOString(),
      latest_actions: ["game_created"],
      new_die: rollDie(),
      players: [
        {
          host: true,
          id: playerId,
          name: sanitizedName,
          dice: [],
          score: 0,
        },
      ],
      rematch_id: null,
      secrets: [{ id: playerId, secret: playerSecretId }],
      status: "lobby",
      version: 1,
      type,
      winner: [],
    };
  } else {
    newGameData = {
      active_player: playerId,
      created: new Date().toISOString(),
      latest_actions: ["game_created", "game_started"],
      new_die: rollDie(),
      players: [
        {
          host: true,
          id: playerId,
          name: sanitizedName,
          dice: [],
          score: 0,
        },
        {
          host: true,
          id: botId,
          name: "Beelzebub",
          dice: [],
          score: 0,
        },
      ],
      rematch_id: null,
      secrets: [
        { id: playerId, secret: playerSecretId },
        { id: botId, secret: botSecretId },
      ],
      status: "playing",
      version: 1,
      type,
      winner: [],
    };
  }

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
