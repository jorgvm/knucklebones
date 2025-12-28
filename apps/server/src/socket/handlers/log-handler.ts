import type { Socket } from "socket.io";
import { config } from "~/config/config.js";

export function registerLogHandler(socket: Socket) {
  if (config.nodeEnv === "development") {
    socket.onAny((eventName, ...args) => {
      console.log(`Socket Event: ${eventName}`, args);
    });
  }
}
