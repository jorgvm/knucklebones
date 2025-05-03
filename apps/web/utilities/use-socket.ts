import { ref, onUnmounted } from "vue";
import { io, type Socket } from "socket.io-client";

export const useSocketIO = (url: string) => {
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

  const sendMessage = (message: string) => {
    if (socket.value && isConnected.value) {
      socket.value.emit("message", message);
    } else {
      console.warn("Socket.IO is not connected");
    }
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
    }
  };

  onUnmounted(() => disconnect());

  return { messages, isConnected, sendMessage, disconnect };
};
