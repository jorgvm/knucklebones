<script setup lang="ts">
  import { socketService } from "~/utilities/socket-service";

  onMounted(() => {
    socketService.connect();
  });

  onUnmounted(() => {
    socketService.disconnect();
  });

  // Provide socket to app
  provide("socketService", socketService);
</script>

<template>
  <NuxtPage v-if="socketService.isConnected.value" />
  <GameLoading v-if="!socketService.isConnected.value" />
</template>
