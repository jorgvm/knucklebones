import { createGameInDatabase } from "~/utilities/firebase";
import { generateId } from "~/utilities/generate-id";
import { rollDice } from "~/utilities/roll-dice";
import { sanitizeName } from "~/utilities/sanitise";

export default defineEventHandler(async (event) => {
  const { playerName } = await readBody(event);

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
    new_dice: rollDice(),
  });

  if (!gameId) {
    throw new Error();
  }

  return {
    playerId,
    gameId,
  };
});
