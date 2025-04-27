<script setup lang="ts">
  import { provide } from "vue";
  import { COOKIE_PLAYER_ID } from "~/utilities/constants";

  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);
  const route = useRoute();
  const { gameId } = route.params;
  const pollCount = ref(0);
  const shouldPoll = computed(() => pollCount.value < 30);

  // Fetch data on load
  const fetchData = async () =>
    await $fetch("/api/get-game", {
      method: "post",
      body: { gameId, playerId: cookiePlayerId.value },
    });

  const gameData = ref(await fetchData());

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
  <GameBoard v-if="gameData?.status === 'playing'" />
  <GameLobby v-if="gameData?.status === 'lobby'" />
  <GamePaused v-if="!shouldPoll" :handle-continue="handleContinue" />
</template>
