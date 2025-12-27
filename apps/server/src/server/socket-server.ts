import { Server } from "socket.io";
import { config } from "~/config/env.js";
import { httpServer } from "./http-server.js";

export const io = new Server(httpServer, {
  cors: {
    origin: config.corsAllowedUrl,
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1000,
});
