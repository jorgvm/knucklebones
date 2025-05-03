<script setup lang="ts">
  import { useSocketIO } from "~/utilities/use-socket";

  const message = ref("");
  const { messages, isConnected, sendMessage } = useSocketIO(
    "http://localhost:8080",
  );
</script>

<template>
  <div>
    <h2>WebSocket Chat</h2>
    <p>Status: {{ isConnected ? "Connected" : "Disconnected" }}</p>
    <input v-model="message" placeholder="Type a message" />
    <button @click="sendMessage(message)">Send</button>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
  </div>
</template>
