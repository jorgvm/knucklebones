<script lang="ts" setup>
  import { ref } from "vue";
  import { useRouter, useCookie } from "nuxt/app";
  import {
    COOKIE_PLAYER_ID,
    COOKIE_PLAYER_NAME,
    COOKIE_PLAYER_SECRET_ID,
    MAX_PLAYER_NAME_LENGTH,
  } from "@shared/utilities/constants";
  import { sanitizeName } from "@shared/utilities/sanitise";
  import type { GameType, ResultCreateGameData } from "@shared/types";
  import type { SocketService } from "~/utilities/socket-service";

  const { type } = defineProps<{ type: GameType }>();

  const cookiePlayerName = useCookie(COOKIE_PLAYER_NAME);
  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);
  const cookiePlayerSecretId = useCookie(COOKIE_PLAYER_SECRET_ID);

  const playerName = ref(String(cookiePlayerName.value ?? ""));
  const isSubmitting = ref(false);
  const router = useRouter();

  const socketService = inject<SocketService>("socketService");

  if (!socketService) {
    throw new Error("Socket service not defined");
  }

  const onSubmit = async () => {
    const playerNameTrimmed = playerName.value.trim();
    if (!playerNameTrimmed) {
      return;
    }

    isSubmitting.value = true;
    cookiePlayerName.value = playerNameTrimmed;

    socketService.sendCreateGame(
      {
        playerName: playerNameTrimmed,
        playerId: cookiePlayerId.value || null,
        playerSecretId: cookiePlayerSecretId.value || null,
        type,
      },
      handleCreateGameResult,
    );
  };

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    playerName.value = sanitizeName(input.value);
  };

  const isLoading = computed(() => {
    return isSubmitting.value || !socketService.isConnected;
  });

  const handleCreateGameResult = ({
    playerId,
    gameId,
    playerSecretId,
  }: ResultCreateGameData) => {
    cookiePlayerId.value = playerId;
    cookiePlayerSecretId.value = playerSecretId;

    isSubmitting.value = false;
    router.push("/" + gameId);
  };
</script>

<template>
  <form class="box flex flex-col" @submit.prevent="onSubmit">
    <h1>Creating game</h1>

    <UiTextInput
      v-model="playerName"
      label="What is your name?"
      type="text"
      :disabled="isLoading"
      class="mb-4"
      :maxlength="MAX_PLAYER_NAME_LENGTH"
      minlength="3"
      name="player-name"
      @input="handleInput"
    />

    <button type="submit" :disabled="isLoading" class="button">
      {{ isLoading ? "loading..." : "create game" }}
    </button>
  </form>
</template>
