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
  <div
    class="flex min-h-svh flex-col items-center justify-center bg-cover p-4 text-neutral-200"
  >
    <NuxtPage />
  </div>
</template>
