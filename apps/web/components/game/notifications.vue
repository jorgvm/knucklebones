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

  const isTie = computed(() => gameData.value.winner.length > 1);

  const localPlayerWon = computed(() =>
    gameData.value.players.some((p) => p.id === cookiePlayerId.value),
  );

  const nowPlayingName = computed(() => {
    const playerId = gameData.value.active_player;
    return gameData.value.players.find((p) => p.id === playerId)?.name;
  });

  const localPlayerTurn = computed(() => {
    return gameData.value.active_player === cookiePlayerId.value;
  });
</script>

<template>
  <div class="flex min-h-8 w-full justify-center text-2xl text-yellow-400">
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

    <div
      v-if="gameData.status === 'finished'"
      class="absolute top-1/2 z-10 flex w-full -translate-y-1/2 flex-col items-center justify-center gap-4 py-20"
    >
      <span v-if="isTie" class="text-4xl">It's a tie!</span>

      <span v-if="!isTie" class="text-4xl">{{
        localPlayerWon ? "You won!" : "You lose!"
      }}</span>

      <UiButton
        v-if="gameData.rematch_id"
        :to="gameData.rematch_id"
        :small="true"
        class="mt-4"
      >
        Rematch
      </UiButton>
    </div>
  </div>
</template>
