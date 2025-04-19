<script lang="ts" setup>
  import { inject } from "vue";
  import { COOKIE_PLAYER_ID } from "~/utilities/constants";
  import type { GameData } from "~/utilities/types";

  const url = useRequestURL();

  const gameData = inject<GameData>("gameData");

  if (!gameData) {
    throw new Error("GameData was not provided");
  }

  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);
  const isHost = gameData.players?.some((i) => i.id === cookiePlayerId.value);
</script>

<template>
  <div>
    <div v-if="isHost">
      <p>Waiting for other players</p>

      <p>Send them this link:</p>

      <input type="text" disabled :value="url" className="w-[500px]" />
    </div>

    <GameNameForm v-if="!isHost" type="join-game" />
  </div>
</template>
