import type {
  DataHandler,
  ResultCreateGameData,
  SendCreateGameData,
} from "@knucklebones/shared/types.js";
import type { Socket } from "socket.io";
import { actionCreateGame } from "~/actions/create-game.js";

export function registerCreateGameHandler(socket: Socket) {
  socket.on(
    "createGame",
    async (data: string, callback: DataHandler<ResultCreateGameData>) => {
      const parsedData: SendCreateGameData = JSON.parse(data);
      const result = await actionCreateGame(parsedData);
      callback(result);
    }
  );
}
