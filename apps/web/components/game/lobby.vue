<script lang="ts" setup>
  import { inject } from "vue";

  import type { GameData } from "@shared/types";
  import { COOKIE_PLAYER_ID } from "@shared/utilities/constants";

  const url = useRequestURL();

  const gameData = inject<Ref<GameData>>("gameData");

  if (!gameData?.value) {
    throw new Error("GameData was not provided");
  }

  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);

  const localPlayerIsHost = computed(() =>
    Boolean(
      gameData.value.players?.find((i) => i.id === cookiePlayerId.value)?.host,
    ),
  );
</script>

<template>
  <div v-if="localPlayerIsHost">
    <p>Waiting for other players</p>

    <p>Send them this link:</p>

    <input type="text" disabled :value="url" class="w-[500px]" />
  </div>

  <GameJoinGameForm v-if="!localPlayerIsHost" />
</template>
