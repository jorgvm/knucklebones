<script setup lang="ts">
  import { ref } from "vue";
  import { useSocketIO } from "~/utilities/use-socket";

  // URL for WebSocket server (replace with your actual URL)

  const { messages, isConnected, sendMessage, disconnect } = useSocketIO();

  const newMessage = ref("");
</script>

<template>
  <div>
    <h1>WebSocket Client</h1>

    <!-- Display Connection Status -->
    <p v-if="isConnected">Connected to WebSocket</p>
    <p v-else>Disconnected from WebSocket</p>

    <!-- Show messages received -->
    <div v-if="messages.length > 0">
      <h2>Messages:</h2>
      <ul>
        <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
      </ul>
    </div>

    <!-- Input to send a new message -->
    <input v-model="newMessage" placeholder="Type a message" />
    <button @click="sendMessage(newMessage)">Send Message</button>

    <!-- Button to disconnect -->
    <button @click="disconnect">Disconnect</button>

    <NuxtPage />
  </div>
</template>
