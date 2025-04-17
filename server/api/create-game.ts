import { createGameInDatabase } from "~/server/utilities/firebase";

export default defineEventHandler(async (event) => {
  const { playerName } = await readBody(event);
  const playerId = crypto.randomUUID();

  // Create game
  const gameId = await createGameInDatabase({
    creation_date: new Date(),
    version: 1,
    players: [
      {
        host: true,
        id: playerId,
        name: playerName,
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
