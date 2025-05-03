<script setup lang="ts">
  import { provide } from "vue";
  import { COOKIE_PLAYER_ID } from "~/utilities/constants";
  import type { GameData } from "@shared/types";

  const route = useRoute();
  const router = useRouter();
  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);
  const { gameId } = route.params;
  const pollCount = ref(0);
  const shouldPoll = computed(() => pollCount.value < 30);

  // Fetch data on load
  const fetchData = async () =>
    await $fetch("/api/get-game", {
      method: "post",
      body: { gameId, playerId: cookiePlayerId.value },
    });

  const gameData: Ref<GameData> = ref(await fetchData());

  // Fetch the new game data every X seconds
  const pollData = async () => {
    if (!shouldPoll.value) {
      return;
    }

    // Fetch data
    pollCount.value++;
    const newData = await fetchData();

    // Only save data if new version was found
    if (newData.version > gameData.value.version) {
      gameData.value = newData;
      pollCount.value = 0;
    }
  };

  const intervalId = setInterval(pollData, 2000);

  const handleContinue = () => {
    pollCount.value = 0;
    pollData();
  };

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

  // Cleanup
  onBeforeUnmount(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
</script>

<template>
  <GameBoard
    v-if="gameData.status === 'playing' || gameData.status === 'finished'"
  />
  <GameLobby v-if="gameData?.status === 'lobby'" />
  <GamePaused v-if="!shouldPoll" :handle-continue="handleContinue" />
  {{ gameData.status === "finished" ? "We have a winner" : "" }}
</template>
