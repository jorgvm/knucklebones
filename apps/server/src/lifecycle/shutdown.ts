import type { Server as HttpServer } from "http";
import type { Server as SocketServer } from "socket.io";
import { cleanupAllListeners } from "~/socket/game-listeners.js";

export async function shutdown(
  io: SocketServer,
  httpServer: HttpServer
): Promise<void> {
  console.log("Shutting down");

  // Unsubscribe all Firestore listeners
  cleanupAllListeners();

  // Close socket.io
  io.close(() => {
    console.log("Socket.IO closed");
  });

  // Close server
  httpServer.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });

  // Force exit after timeout
  setTimeout(() => {
    console.error("forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}

export function registerShutdownHandlers(
  io: SocketServer,
  httpServer: HttpServer
) {
  process.on("SIGTERM", () => shutdown(io, httpServer));
  process.on("SIGINT", () => shutdown(io, httpServer));
}
