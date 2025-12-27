import type { Server, Socket } from "socket.io";
import { cleanupEmptyRoomListeners, gameListeners } from "../game-listeners.js";

export function registerDisconnectHandler(socket: Socket, io: Server) {
  socket.on("disconnect", () => {
    // Check which rooms are now empty and clean up listeners
    cleanupEmptyRoomListeners((gameId: string) => {
      const room = io.sockets.adapter.rooms.get(gameId);
      return room ? room.size : 0;
    });
    console.log(
      `User disconnected. Listeners remaining: ${gameListeners.size}`
    );
  });
}
