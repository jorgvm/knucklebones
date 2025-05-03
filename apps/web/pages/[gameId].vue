<script setup lang="ts">
  import { provide } from "vue";
  import type { GameData } from "@shared/types";
  import { COOKIE_PLAYER_ID } from "@shared/utilities/constants";

  const route = useRoute();
  const router = useRouter();
  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);
  const { gameId } = route.params;

  const gameDefaults: GameData = {
    id: "x",
    status: "lobby",
    players: [],
    version: 1,
    active_player: "",
  };

  const gameData: Ref<GameData> = ref(gameDefaults);

  // Redirect if player is not part of the game
  watch(
    gameData,
    (newGameData) => {
      const player = newGameData.players.find(
        (i) => i.id === cookiePlayerId.value,
      );

      if (!player && gameData.value.status !== "lobby") {
        router.replace("/wrong-game");
      }
    },
    { immediate: true },
  );

  // Provider
  provide("gameData", gameData);
</script>

<template>
  <GameBoard
    v-if="gameData.status === 'playing' || gameData.status === 'finished'"
  />
  <GameLobby v-if="gameData?.status === 'lobby'" />

  {{ gameData.status === "finished" ? "We have a winner" : "" }}
</template>
