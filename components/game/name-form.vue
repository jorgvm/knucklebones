<script lang="ts" setup>
  import { ref } from "vue";
  import { COOKIE_PLAYER_ID } from "~/utilities/constants";

  const { type } = defineProps<{
    type: "join-game" | "create-game";
  }>();

  const playerName = ref("");
  const isLoading = ref(false);

  const onSubmit = async () => {
    if (!playerName.value) {
      return;
    }

    isLoading.value = true;

    if (type === "create-game") {
      createGame();
    } else {
      joinGame();
    }
  };

  const createGame = async () => {
    const { gameId, playerId } = await $fetch("/api/create-game", {
      method: "post",
      body: { playerName: playerName.value },
    });

    // Set player id
    const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);
    cookiePlayerId.value = playerId;

    // Navigate to new game
    await navigateTo("/" + gameId);
  };

  const joinGame = async () => {
    const route = useRoute();
    const { gameId } = route.params;

    const { playerId } = await $fetch("/api/join-game", {
      method: "post",
      body: { gameId, playerName: playerName.value },
    });

    // Set player id
    const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);
    cookiePlayerId.value = playerId;
  };
</script>

<template>
  <div>
    <form class="flex max-w-[300px] flex-col" @submit.prevent="onSubmit">
      <span>What is your name?</span>

      <input
        v-model="playerName"
        type="text"
        :disabled="isLoading"
        class="border border-amber-300"
      />

      <button type="submit" :disabled="isLoading">create game</button>
    </form>
  </div>
</template>
