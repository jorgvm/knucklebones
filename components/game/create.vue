<script lang="ts" setup>
import { ref } from "vue";

const playerName = ref("");
const isLoading = ref(false);

const onSubmit = async () => {
  if (!playerName.value) {
    return;
  }

  isLoading.value = true;

  // Create new game
  const { gameId, playerId } = await $fetch("/api/create-game", {
    method: "post",
    body: { playerName: playerName.value },
  });

  // Set player id
  const cookiePlayerId = useCookie("player-id");
  cookiePlayerId.value = playerId;

  // Navigate to new game
  await navigateTo("/" + gameId);
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
