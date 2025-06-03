<script lang="ts" setup>
  import { ref } from "vue";
  import {
    COOKIE_PLAYER_ID,
    COOKIE_PLAYER_NAME,
    COOKIE_PLAYER_SECRET_ID,
    MAX_PLAYER_NAME_LENGTH,
  } from "@shared/utilities/constants";
  import { sanitizeName } from "@shared/utilities/sanitise";

  import { useRouter, useCookie } from "nuxt/app";

  import type { ResultCreateGameData } from "@shared/types";
  import type { SocketService } from "~/utilities/socket-service";

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
    if (!playerName.value.trim()) {
      console.warn("Player name is empty");
      return;
    }

    isSubmitting.value = true;
    cookiePlayerName.value = playerName.value;

    socketService.sendCreateGame({
      playerName: playerName.value,
      playerId: cookiePlayerId.value || null,
      playerSecretId: cookiePlayerSecretId.value || null,
    });
  };

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    playerName.value = sanitizeName(input.value);
  };

  const isLoading = computed(() => {
    return isSubmitting.value || !socketService.isConnected;
  });

  const handleCreateGameResult = (data: ResultCreateGameData) => {
    const { playerId, gameId, playerSecretId }: ResultCreateGameData = data;

    cookiePlayerId.value = playerId;
    cookiePlayerSecretId.value = playerSecretId;

    isSubmitting.value = false;
    router.push("/" + gameId);
  };

  onMounted(() => {
    if (socketService.socket.value) {
      socketService.socket.value.on("createGameResult", handleCreateGameResult);
    }
  });

  onBeforeUnmount(() => {
    if (socketService.socket.value) {
      socketService.socket.value.off(
        "createGameResult",
        handleCreateGameResult,
      );
    }
  });
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
