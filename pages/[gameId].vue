<script setup lang="ts">
  import { provide } from "vue";
  import { COOKIE_PLAYER_ID } from "~/utilities/constants";

  // Fetch game
  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);
  const route = useRoute();
  const { gameId } = route.params;

  const gameData = await $fetch("/api/get-game", {
    method: "post",
    body: { gameId, playerId: cookiePlayerId.value },
  });

  // Provide data
  provide("gameData", gameData);
</script>

<template>
  <div>
    <GameBoard v-if="gameData?.status === 'playing'" />
    <GameLobby v-if="gameData?.status === 'lobby'" />
  </div>
</template>
