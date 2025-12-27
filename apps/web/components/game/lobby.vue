<script lang="ts" setup>
  import { inject } from "vue";
  import type { GameData } from "@shared/types";
  import { COOKIE_PLAYER_ID } from "@shared/utilities/constants";
  import { twMerge } from "tailwind-merge";
  import { waitFor } from "@shared/utilities/wait-for";

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

  const handleCopyToClipboard = async () => {
    navigator.clipboard.writeText(shareURL.toString());

    // show message
    showCopied.value = true;
    await waitFor(1000);
    showCopied.value = false;
  };
</script>

<template>
  <UiBox v-if="localPlayerIsHost">
    <h1>Lobby</h1>

    <p>To start the game, send this link to a friend!</p>

    <p class="overflow-hidden font-mono">
      {{ shareURL.toString() }}
    </p>

    <div class="flex items-center gap-4">
      <UiButton @click="handleCopyToClipboard">copy</UiButton>

      <p
        :class="
          twMerge('opacity-0 transition-all', showCopied && 'opacity-100')
        "
      >
        copied!
      </p>
    </div>
  </UiBox>
</template>
