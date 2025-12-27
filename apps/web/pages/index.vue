<script lang="ts" setup>
  import socketService from "~/utilities/socket-service";
</script>

<template>
  <h1 class="text-5xl uppercase">Knucklesbones</h1>

  <UiBox>
    <UiButton to="/singleplayer">Singleplayer</UiButton>
    <UiButton to="/multiplayer">Multiplayer</UiButton>
    <UiButton to="/tutorial">Tutorial</UiButton>
  </UiBox>

  <UiLoading :active="!socketService.isConnected.value" />
</template>
