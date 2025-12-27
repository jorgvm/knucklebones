import type {
  DataHandler,
  ResultJoinGameData,
  SendJoinGameData,
} from "@knucklebones/shared/types.js";
import type { Socket } from "socket.io";
import { actionJoinGame } from "~/actions/join-game.js";

export function registerJoinGameHandler(socket: Socket) {
  socket.on(
    "joinGame",
    async (data: string, callback: DataHandler<ResultJoinGameData>) => {
      const parsedData: SendJoinGameData = JSON.parse(data);
      const result = await actionJoinGame(parsedData);
      callback(result);
    }
  );
}
