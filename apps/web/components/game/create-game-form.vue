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
    socketService.sendCreateGame({ playerName: playerName.value });
  };

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    playerName.value = sanitizeName(input.value);
  };

  const isLoading = computed(
    () => isSubmitting.value || !socketService.isConnected,
  );

  watch(
    () => socketService.socket.value,
    (socket) => {
      socket?.on("createGameResult", (data) => {
        const { playerId, gameId, playerSecretId }: ResultCreateGameData = data;

        cookiePlayerId.value = playerId;
        cookiePlayerSecretId.value = playerSecretId;

        isSubmitting.value = false;
        router.push("/" + gameId);
      });
    },
  );
</script>

<template>
  <div>
    <form class="flex max-w-[300px] flex-col" @submit.prevent="onSubmit">
      <h1>Creating game</h1>
      <span>What is your name?</span>

      <input
        v-model="playerName"
        type="text"
        :disabled="isLoading"
        class="border border-amber-300"
        :maxlength="MAX_PLAYER_NAME_LENGTH"
        minlength="3"
        @input="handleInput"
      />

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? "loading..." : "create game" }}
      </button>
    </form>
  </div>
</template>
