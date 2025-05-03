<script lang="ts" setup>
  import { ref } from "vue";
  import {
    COOKIE_PLAYER_ID,
    MAX_PLAYER_NAME_LENGTH,
  } from "~/utilities/constants";
  import { sanitizeName } from "~/utilities/sanitise";

  const { type } = defineProps<{
    type: "join-game" | "create-game";
  }>();

  const playerName = ref("");
  const isLoading = ref(false);

  const onSubmit = async () => {
    if (!playerName.value.trim()) {
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

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    playerName.value = sanitizeName(input.value);
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
        :maxlength="MAX_PLAYER_NAME_LENGTH"
        minlength="3"
        @input="handleInput"
      />

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? "loading..." : "create game" }}
      </button>
    </form>
  </div>
</template>
