import type {
  DataHandler,
  ResultJoinGameData,
  SendJoinGameData,
} from "@knucklebones/shared/types.js";
import type { Server, Socket } from "socket.io";
import { actionJoinGame } from "~/actions/join-game.js";

export function registerJoinGameHandler(socket: Socket, io: Server): void {
  socket.on(
    "joinGame",
    async (data: string, callback: DataHandler<ResultJoinGameData>) => {
      const parsedData: SendJoinGameData = JSON.parse(data);
      const { publicGameData, playerId, playerSecretId } =
        await actionJoinGame(parsedData);

      // Return ids for user
      callback({ playerId, playerSecretId });

      // Notify all players
      io.to(publicGameData.id).emit("gameUpdate", publicGameData);
    },
  );
}
