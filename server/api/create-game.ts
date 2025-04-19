import { createGameInDatabase } from "~/server/utilities/firebase";
import { sanitizeName } from "~/utilities/sanitise";

export default defineEventHandler(async (event) => {
  const { playerName } = await readBody(event);

  const sanitizedName = sanitizeName(playerName.trim());

  if (!sanitizedName) {
    throw new Error("No valid name was supplied");
  }

  // Create game
  const playerId = crypto.randomUUID();

  const gameId = await createGameInDatabase({
    creation_date: new Date(),
    version: 1,
    players: [
      {
        host: true,
        id: playerId,
        name: sanitizedName,
      },
    ],
    active_player: playerId,
    status: "lobby",
    winner: null,
    dice_list: [],
  });

  if (!gameId) {
    throw new Error();
  }

  return {
    playerId,
    gameId,
  };
});
