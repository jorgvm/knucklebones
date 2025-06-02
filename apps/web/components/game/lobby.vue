<script lang="ts" setup>
  import { inject } from "vue";

  import type { GameData } from "@shared/types";
  import { COOKIE_PLAYER_ID } from "@shared/utilities/constants";

  const shareURL = useRequestURL()
    .toString()
    .replace(/^https?:\/\//, "");

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

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareURL.toString());
  };
</script>

<template>
  <div v-if="localPlayerIsHost" class="box">
    <h1>Waiting for other players</h1>

    <p>Send them this link:</p>

    <span>
      {{ shareURL.toString() }}
    </span>

    <button class="button ml-4" type="button" @click="handleCopyToClipboard">
      copy
    </button>
  </div>

  <GameJoinGameForm v-if="!localPlayerIsHost" />
</template>
