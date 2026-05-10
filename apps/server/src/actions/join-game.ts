import type { Player, SendJoinGameData } from "@knucklebones/shared/types.js";
import { sanitizeName } from "@knucklebones/shared/utilities/sanitise.js";
import { generateId, isValidCryptoId } from "~/utilities/generate-id.js";
import { randomIntBetween } from "@knucklebones/shared/utilities/random-int-between.js";
import { getGameFromDatabase } from "~/database/get-game.js";
import { updateGameInDatabase } from "~/database/update-game.js";
import { toPublicGameData } from "~/utilities/to-public-gamedata.js";

export const actionJoinGame = async ({
  playerName,
  gameId,
  playerId: providedPlayerId,
  playerSecretId: providedPlayerSecretId,
}: SendJoinGameData) => {
  const sanitizedName = sanitizeName(playerName);

  // All ids should be valid
  if (!sanitizedName || !isValidCryptoId(gameId)) {
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
  const updatedGame = await updateGameInDatabase(gameId, {
    players: [...gameData.players, newPlayer],
    active_player: newActivePlayer,
    status: "playing",
    secrets: [...gameData.secrets, newPlayerSecret],
    latest_actions: ["game_started"],
  });

  const publicGameData = toPublicGameData(updatedGame);

  return {
    publicGameData,
    playerId,
    playerSecretId,
  };
};
