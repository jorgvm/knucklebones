import { arrayUnion } from "firebase/firestore";
import { updateGameInDatabase } from "~/server/utilities/firebase";
import type { Player } from "~/utilities/types";

export default defineEventHandler(async (event) => {
  const { playerName, gameId } = await readBody(event);
  const playerId = crypto.randomUUID();
  console.log("join game:", playerName, gameId);
  // Create game
  const newPlayer = {
    host: false,
    id: playerId,
    name: playerName,
  };

  const result = await updateGameInDatabase(gameId, {
    players: arrayUnion(newPlayer) as unknown as Player[],
  });

  console.log("join game result", result);

  if (!gameId) {
    throw new Error();
  }

  return {
    playerId,
  };
});
