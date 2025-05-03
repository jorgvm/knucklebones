import { actionJoinGame } from "~/server-actions/join-game";
import { serverError } from "~/utilities/server-error";

export default defineEventHandler(async (event) => {
  try {
    // Only allow POST
    if (event.node.req.method !== "POST") {
      throw Error("Invalid request");
    }

    // Get params
    const { playerName, gameId }: { playerName: string; gameId: string } =
      await readBody(event);

    // Return result
    return await actionJoinGame({ playerName, gameId });
  } catch (e: unknown) {
    return serverError(e);
  }
});
