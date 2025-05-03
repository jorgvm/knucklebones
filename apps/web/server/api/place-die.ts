import { actionPlaceDie } from "~/server-actions/place-die";
import { serverError } from "~/utilities/server-error";
import type { GameId, PlayerId, RackNumber } from "~/utilities/types";

export default defineEventHandler(async (event) => {
  try {
    // Only allow POST
    if (event.node.req.method !== "POST") {
      throw Error("Invalid request");
    }

    // Get params
    const {
      gameId,
      playerId,
      rackNumber,
    }: { gameId: GameId; playerId: PlayerId; rackNumber: RackNumber } =
      await readBody(event);

    // Return result
    return await actionPlaceDie({ gameId, playerId, rackNumber });
  } catch (e: unknown) {
    return serverError(e);
  }
});
