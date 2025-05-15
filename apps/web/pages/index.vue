<script lang="ts" setup>
  const socketService = inject(
    "socketService",
  ) as typeof import("../utilities/socket-service").socketService;
</script>

<template>
  <div>
    <GameNameForm type="create-game" />
    <GameLoading v-if="!socketService.isConnected.value" />
  </div>
</template>
