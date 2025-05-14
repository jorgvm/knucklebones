<script lang="ts" setup>
  import { COOKIE_PLAYER_ID } from "@shared/utilities/constants";
  import type { GameData } from "@shared/types";

  const gameData = inject<Ref<GameData>>("gameData");
  if (!gameData?.value) {
    throw new Error("GameData was not provided");
  }

  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);

  const opponentId = computed(() => {
    const result = String(
      gameData.value.players?.find((i) => i.id !== cookiePlayerId.value)?.id,
    );

    return result;
  });
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      {{ cookiePlayerId }}
    </div>
    <GamePlayerSection :player-id="opponentId" :is-local-player="false" />

    <GamePlayerSection
      :player-id="cookiePlayerId || ''"
      :is-local-player="true"
    />
  </div>
</template>
