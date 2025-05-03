import { ref, onUnmounted } from "vue";
import { io, type Socket } from "socket.io-client";
const url = "http://localhost:8080";

export const useSocketIO = () => {
  const socket = ref<Socket | null>(null);
  const messages = ref<string[]>([]);
  const isConnected = ref(false);

  if (import.meta.client) {
    socket.value = io(url);

    socket.value.on("connect", () => {
      console.log("Socket.IO connected");
      isConnected.value = true;
    });

    socket.value.on("message", (message: string) => {
      messages.value.push(message);
      console.log("Received:", message);
    });

    socket.value.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      isConnected.value = false;
      socket.value = null;
    });

    socket.value.on("connect_error", (error) => {
      console.error("Socket.IO error:", error);
    });
  }

  const sendMessage = (payload: { action: string; data: any }) => {
    if (socket.value && isConnected.value) {
      socket.value.emit(payload.action, JSON.stringify(payload.data));
    } else {
      console.warn("Socket.IO is not connected");
    }
  };

  const sendCreateGame = (playerName: string) => {
    sendMessage({ action: "createGame", data: { playerName } });
  };

  const sendJoinGame = (gameId: string, playerName: string) => {
    sendMessage({ action: "joinGame", data: { gameId, playerName } });
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
    }
  };

  onUnmounted(() => disconnect());

  return {
    messages,
    isConnected,
    sendMessage,
    disconnect,
    socket,
    sendCreateGame,
    sendJoinGame,
  };
};
