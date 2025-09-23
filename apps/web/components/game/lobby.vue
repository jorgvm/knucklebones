<script lang="ts" setup>
  import { inject } from "vue";
  import type { GameData } from "@shared/types";
  import { COOKIE_PLAYER_ID } from "@shared/utilities/constants";
  import { twMerge } from "tailwind-merge";

  const showCopied = ref(false);

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
    showCopied.value = true;

    setTimeout(() => {
      showCopied.value = false;
    }, 1000);
  };
</script>

<template>
  <div v-if="localPlayerIsHost" class="box flex flex-col gap-4">
    <h1>Lobby</h1>

    <p>To start the game, send this link to a friend!</p>

    <p class="font-mono">
      {{ shareURL.toString() }}
    </p>

    <div class="flex items-center gap-4">
      <button class="button" type="button" @click="handleCopyToClipboard">
        copy
      </button>

      <p
        :class="
          twMerge('opacity-0 transition-all', showCopied && 'opacity-100')
        "
      >
        copied!
      </p>
    </div>
  </div>
</template>
