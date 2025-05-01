import { createGameInDatabase } from "~/utilities/firebase";
import { generateId } from "~/utilities/generate-id";
import { rollDie } from "~/utilities/roll-die";
import { sanitizeName } from "~/utilities/sanitise";
import type { PlayerName } from "~/utilities/types";

export const actionCreateGame = async ({
  playerName,
}: {
  playerName: PlayerName;
}) => {
  const sanitizedName = sanitizeName(playerName.trim());

  if (!sanitizedName) {
    throw new Error("No valid name was supplied");
  }

  // Create game
  const playerId = generateId();

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
  });

  if (!gameId) {
    throw new Error();
  }

  return {
    playerId,
    gameId,
  };
};
