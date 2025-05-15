<script lang="ts" setup>
  import socketService from "~/utilities/socket-service";
</script>

<template>
  <div>
    <GameCreateGameForm />
    <GameLoading v-if="!socketService.isConnected.value" />
  </div>
</template>
