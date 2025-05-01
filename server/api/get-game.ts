import { actionGetGame } from "~/server-actions/get-game";
import { serverError } from "~/utilities/server-error";

export default defineEventHandler(async (event) => {
  try {
    // Only allow POST
    if (event.node.req.method !== "POST") {
      throw Error("Invalid request");
    }

    // Get params
    const { gameId, playerId }: { gameId: string; playerId: string } =
      await readBody(event);

    // Return result
    return await actionGetGame({ gameId, playerId });
  } catch (e: unknown) {
    return serverError(e);
  }
});
