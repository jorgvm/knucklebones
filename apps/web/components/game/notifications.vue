<script lang="ts" setup>
  import { inject } from "vue";
  import type { GameData } from "@shared/types";
  import { COOKIE_PLAYER_ID } from "@shared/utilities/constants";
  import { twMerge } from "tailwind-merge";

  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);

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

  const localPlayerTurn = computed(() => {
    return gameData.value.active_player === cookiePlayerId.value;
  });
</script>

<template>
  <div class="h-8 w-full text-2xl text-yellow-700">
    <div
      v-if="gameData.status === 'playing'"
      class="flex items-center justify-center gap-4 text-center"
    >
      {{ localPlayerTurn ? "your move" : "waiting on " + nowPlayingName }}

      <GameDie
        :key="gameData.version"
        :value="gameData.new_die"
        :class-name="twMerge('relative mb-0 animate-die-in scale-60')"
      />
    </div>

    <div v-if="gameData.status === 'finished'" class="flex items-center gap-4">
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
  </div>
</template>
