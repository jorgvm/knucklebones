<script setup lang="ts">
  import socketService, {
    type SocketService,
  } from "~/utilities/socket-service";

  onMounted(() => {
    socketService.connect();
  });

  onUnmounted(() => {
    socketService.disconnect();
  });

  // Provide socket to app
  provide("socketService", socketService as SocketService);
</script>

<template>
  <NuxtPage />
</template>
