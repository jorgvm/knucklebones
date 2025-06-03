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

  const nowPlayingName = computed(() => {
    const playerId = gameData.value.active_player;
    return gameData.value.players.find((p) => p.id === playerId)?.name;
  });
</script>

<template>
  <div
    v-if="gameData.status === 'playing'"
    class="header-font w-full items-center gap-4 text-center text-2xl"
  >
    now playing:
    <span class="text-amber-300">
      {{ nowPlayingName }}
    </span>
  </div>

  <div
    v-if="gameData.status === 'finished'"
    class="header-font flex items-center gap-4 text-2xl"
  >
    <span v-if="isTie">It's a tie!</span>

    <span v-if="!isTie">Winner: {{ winnerName }}!</span>

    <RouterLink
      v-if="gameData.rematch_id"
      class="button"
      :to="gameData.rematch_id"
    >
      Rematch!
    </RouterLink>
  </div>
</template>
