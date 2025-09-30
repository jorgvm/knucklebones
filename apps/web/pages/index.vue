<script lang="ts" setup>
  import socketService from "~/utilities/socket-service";
</script>

<template>
  <h1 class="mb-6 text-5xl uppercase">Knucklesbones</h1>

  <div class="box w-full">
    <div class="duration flex flex-col gap-4">
      <RouterLink to="/singleplayer" class="button">Singleplayer</RouterLink>
      <RouterLink to="/multiplayer" class="button">Multiplayer</RouterLink>
      <RouterLink to="/tutorial" class="button">Tutorial</RouterLink>
    </div>
  </div>

  <GameLoading :active="!socketService.isConnected.value" />
</template>
