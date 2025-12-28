import { initSentry, setupErrorHandlers } from "~/config/sentry.js";
import { registerShutdownHandlers } from "~/lifecycle/shutdown.js";
import { httpServer } from "~/server/http-server.js";
import { io } from "~/server/socket-server.js";
import { registerCreateGameHandler } from "~/socket/handlers/create-game.handler.js";
import { registerDisconnectHandler } from "~/socket/handlers/disconnect.handler.js";
import { registerJoinGameHandler } from "~/socket/handlers/join-game.handler.js";
import { registerLogHandler } from "~/socket/handlers/log-handler.js";
import { registerPlaceDieHandler } from "~/socket/handlers/place-die.handler.js";
import { registerSubscribeToGameHandler } from "~/socket/handlers/subscribe-to-game.handler.js";

// Initialize Sentry
initSentry();

// Handle errors
setupErrorHandlers();

// Initialize httpServer
httpServer.listen(process.env.PORT || 8080);

// Initialize websockets, register event handlers
io.on("connection", (socket) => {
  registerLogHandler(socket);
  registerCreateGameHandler(socket);
  registerJoinGameHandler(socket);
  registerPlaceDieHandler(socket);
  registerSubscribeToGameHandler(socket, io);
  registerDisconnectHandler(socket, io);
});

// Register graceful shutdown handlers
registerShutdownHandlers(io, httpServer);
