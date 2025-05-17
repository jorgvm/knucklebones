import { io, type Socket } from "socket.io-client";
import { ref } from "vue";
import type {
  GameMessagePayload,
  SendCreateGameData,
  SendJoinGameData,
  SendPlaceDieData,
  SocketAction,
  SubscribeToGameData,
} from "@shared/types";

export type SocketService = typeof socketService;

const socket = ref<Socket | null>(null);
const messages = ref<string[]>([]);
const isConnected = ref(false);

const connect = () => {
  const runtimeConfig = useRuntimeConfig();
  const gameServerUrl = runtimeConfig.public.gameServerUrl;

  if (import.meta.client && !socket.value) {
    socket.value = io(gameServerUrl);

    socket.value.on("connect", () => {
      isConnected.value = true;
    });

    socket.value.on("message", (message: string) => {
      messages.value.push(message);
    });

    socket.value.on("disconnect", () => {
      isConnected.value = false;
      socket.value = null;
    });

    socket.value.on("connect_error", (error) => {
      console.error("Socket.IO error:", error);
    });
  }
};

const disconnect = () => {
  if (socket.value) {
    socket.value.disconnect();
    socket.value = null;
    isConnected.value = false;
  }
};

const submit = (payload: {
  action: SocketAction;
  data: GameMessagePayload;
}) => {
  if (socket.value && isConnected.value) {
    socket.value.emit(payload.action, JSON.stringify(payload.data));
  } else {
    console.warn("Socket.IO is not connected");
  }
};

const sendCreateGame = ({ playerName }: SendCreateGameData) => {
  submit({ action: "createGame", data: { playerName } });
};

const sendJoinGame = ({ gameId, playerName }: SendJoinGameData) => {
  submit({ action: "joinGame", data: { gameId, playerName } });
};

const sendSubscribeToGame = ({ gameId }: SubscribeToGameData) => {
  submit({ action: "subscribeToGame", data: { gameId } });
};

const sendPlaceDie = (data: SendPlaceDieData) => {
  submit({ action: "placeDie", data });
};

const socketService = {
  socket,
  isConnected,
  connect,
  disconnect,
  sendCreateGame,
  sendJoinGame,
  sendSubscribeToGame,
  sendPlaceDie,
} as const;

export default socketService;
