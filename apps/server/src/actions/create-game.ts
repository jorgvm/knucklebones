import {
  PlayerName,
  PlayerSecretId,
  ResultCreateGameData,
} from "@knucklebones/shared/types.js";
import { sanitizeName } from "@knucklebones/shared/utilities/sanitise.js";
import { createGameInDatabase } from "~/utilities/firebase.js";
import { generateId } from "~/utilities/generate-id.js";
import { rollDie } from "~/utilities/roll-die.js";

export const actionCreateGame = async ({
  playerName,
}: {
  playerName: PlayerName;
}): Promise<ResultCreateGameData> => {
  const sanitizedName = sanitizeName(playerName.trim());

  if (!sanitizedName) {
    throw new Error("No valid name was supplied");
  }

  // Create game
  const playerId = generateId();
  const playerSecretId = generateId();

  const gameId = await createGameInDatabase({
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
    active_player: playerId,
    status: "lobby",
    winner: null,
    new_die: rollDie(),
    secrets: [{ id: playerId, secret: playerSecretId }],
  });

  if (!gameId) {
    throw new Error();
  }

  return {
    playerId,
    playerSecretId,
    gameId,
  };
};
