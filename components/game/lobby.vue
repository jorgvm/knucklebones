<script lang="ts" setup>
  import { inject } from "vue";
  import { COOKIE_PLAYER_ID } from "~/utilities/constants";
  import type { GameData } from "~/utilities/types";

  const url = useRequestURL();

  // Check if user is host
  const gameData = inject("gameData") as GameData;
  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);
  const isHost = gameData.players.some((i) => i.id === cookiePlayerId.value);
</script>

<template>
  <div>
    <div v-if="isHost">
      <p>Waiting for other players</p>

      <p>Send them this link:</p>

      <input type="text" disabled :value="url" />
    </div>

    <GameNameForm v-if="!isHost" type="join-game" />
  </div>
</template>
