import { createGameInDatabase } from "~/server/utilities/firebase";

export default defineEventHandler(async (event) => {
  const { playerName } = await readBody(event);
  const playerId = crypto.randomUUID();
  const gameId = crypto.randomUUID();

  // Create game
  const result = await createGameInDatabase({
    players: [
      {
        host: true,
        id: playerId,
        name: playerName,
      },
    ],
    id: gameId,
    active_player: playerId,
    status: "lobby",
    winner: null,
    dice_list: [],
  });

  if (!result) {
    throw new Error();
  }

  return {
    playerId,
    gameId,
  };
});
