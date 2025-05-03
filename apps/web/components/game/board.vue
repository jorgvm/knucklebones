<script lang="ts" setup>
  import { COOKIE_PLAYER_ID, OPPONENT_ID } from "@shared/utilities/constants";

  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID).value ?? "";
</script>

<template>
  <div class="flex flex-col gap-8">
    <GamePlayerSection :player-id="OPPONENT_ID" :is-local-player="false" />

    <GamePlayerSection :player-id="cookiePlayerId" :is-local-player="true" />
  </div>
</template>
