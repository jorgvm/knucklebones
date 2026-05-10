<script lang="ts" setup>
  import socketService from "~/utilities/socket-service";
</script>

<template>
  <h1 class="text-5xl uppercase">Knucklesbones</h1>

  <UiBox>
    <UiButton data-testid="btn-singleplayer" to="/singleplayer">Singleplayer</UiButton>
    <UiButton data-testid="btn-multiplayer" to="/multiplayer">Multiplayer</UiButton>
    <UiButton to="/tutorial">Tutorial</UiButton>
  </UiBox>

  <UiLoading :active="!socketService.isConnected.value" />
</template>
