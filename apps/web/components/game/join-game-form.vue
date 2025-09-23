<script lang="ts" setup>
  import { ref } from "vue";
  import {
    COOKIE_PLAYER_ID,
    COOKIE_PLAYER_NAME,
    COOKIE_PLAYER_SECRET_ID,
    MAX_PLAYER_NAME_LENGTH,
  } from "@shared/utilities/constants";
  import { sanitizeName } from "@shared/utilities/sanitise";
  import { useRoute } from "nuxt/app";
  import type { SocketService } from "~/utilities/socket-service";
  import type { ResultJoinGameData } from "@shared/types";

  const { updatePlayerCookies } = defineProps<{
    updatePlayerCookies: (d: ResultJoinGameData) => void;
  }>();

  const route = useRoute();

  const cookiePlayerName = useCookie(COOKIE_PLAYER_NAME);
  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);
  const cookiePlayerSecretId = useCookie(COOKIE_PLAYER_SECRET_ID);

  const socketService = inject<SocketService>("socketService");

  if (!socketService) {
    throw new Error("Socket service not defined");
  }

  const playerName = ref(String(cookiePlayerName.value ?? ""));
  const isSubmitting = ref(false);

  const onSubmit = async () => {
    if (!playerName.value.trim()) {
      console.warn("Player name is empty or WebSocket is not connected.");
      return;
    }

    isSubmitting.value = true;

    const gameId = route.params.gameId as string;

    cookiePlayerName.value = playerName.value;

    socketService.sendJoinGame(
      {
        gameId,
        playerName: playerName.value,
        playerId: cookiePlayerId.value || null,
        playerSecretId: cookiePlayerSecretId.value || null,
      },
      updatePlayerCookies, // Handle cookie updates in in [gameId] page, which has the latest version
    );
  };

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    playerName.value = sanitizeName(input.value);
  };

  const isLoading = computed(
    () => isSubmitting.value || !socketService.isConnected,
  );
</script>

<template>
  <form class="box flex flex-col" @submit.prevent="onSubmit">
    <h1>Joining game</h1>

    <UiTextInput
      v-model="playerName"
      label="What is your name?"
      type="text"
      :disabled="isLoading || !socketService.isConnected"
      class="mb-2"
      :maxlength="MAX_PLAYER_NAME_LENGTH"
      minlength="3"
      @input="handleInput"
    />

    <button
      type="submit"
      :disabled="isLoading || !socketService.isConnected"
      class="button"
    >
      {{ isLoading ? "loading..." : "join game" }}
    </button>
  </form>
</template>
