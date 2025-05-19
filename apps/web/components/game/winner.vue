<script lang="ts" setup>
  import { inject } from "vue";
  import type { GameData } from "@shared/types";

  const gameData = inject<Ref<GameData>>("gameData");
  if (!gameData?.value) {
    throw new Error("GameData was not provided");
  }

  const winnerName = computed(
    () =>
      gameData.value.players.find((p) => p.id === gameData.value.winner[0])
        ?.name,
  );

  const isTie = computed(() => gameData.value.winner.length > 1);
</script>

<template>
  <div>
    <div v-if="isTie">It's a tie!</div>

    <div v-if="!isTie">Winner: {{ winnerName }}!</div>

    <RouterLink v-if="gameData.rematch_id" :to="gameData.rematch_id"
      >Rematch!</RouterLink
    >
  </div>
</template>
