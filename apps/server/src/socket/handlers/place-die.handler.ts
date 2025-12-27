import type { SendPlaceDieData } from "@knucklebones/shared/types.js";
import type { Socket } from "socket.io";
import { actionPlaceDie } from "~/actions/place-die.js";

export function registerPlaceDieHandler(socket: Socket) {
  socket.on("placeDie", async (data: string) => {
    const parsedData: SendPlaceDieData = JSON.parse(data);
    await actionPlaceDie(parsedData);
  });
}
