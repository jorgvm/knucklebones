<script lang="ts" setup>
  import { COOKIE_PLAYER_ID } from "@shared/utilities/constants";
  import type { GameData } from "@shared/types";
  import { handleGameSounds } from "~/utilities/play-sound";

  const gameData = inject<Ref<GameData>>("gameData");
  if (!gameData?.value) {
    throw new Error("GameData was not provided");
  }

  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);

  const opponentId = computed(() =>
    String(
      gameData.value.players?.find((i) => i.id !== cookiePlayerId.value)?.id,
    ),
  );

  watch(
    gameData,
    (newGameData) => {
      if (newGameData) {
        handleGameSounds(newGameData, cookiePlayerId.value || undefined);
      }
    },
    { deep: true },
  );
</script>

<template>
  <div class="flex flex-col gap-2">
    <GamePlayerSection
      :section-player-id="opponentId"
      :is-local-player="false"
    />

    <GameNotifications />

    <GamePlayerSection
      :section-player-id="cookiePlayerId || ''"
      :is-local-player="true"
    />
  </div>
</template>
