<script lang="ts" setup>
  import type { SocketService } from "~/utilities/socket-service";

  // Socket
  const socketService = inject<SocketService>("socketService");
  if (!socketService) {
    throw new Error("Socket service not defined");
  }
</script>

<template>
  <GameCreateGameForm />
  <GameLoading v-if="!socketService.isConnected.value" />
</template>
