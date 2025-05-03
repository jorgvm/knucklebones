import { actionCreateGame } from "~/server-actions/create-game";
import { serverError } from "~/utilities/server-error";

export default defineEventHandler(async (event) => {
  try {
    // Only allow POST
    if (event.node.req.method !== "POST") {
      throw Error("Invalid request");
    }

    // Get params
    const { playerName }: { playerName: string } = await readBody(event);

    // Return result
    return await actionCreateGame({ playerName });
  } catch (e: unknown) {
    return serverError(e);
  }
});
