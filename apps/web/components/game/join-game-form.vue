<script lang="ts" setup>
  import { ref } from "vue";
  import { MAX_PLAYER_NAME_LENGTH } from "@shared/utilities/constants";
  import { sanitizeName } from "@shared/utilities/sanitise";
  import { useRoute } from "nuxt/app";
  import type { SocketService } from "~/utilities/socket-service";

  const route = useRoute();

  const socketService = inject<SocketService>("socketService");

  if (!socketService) {
    throw new Error("Socket service not defined");
  }

  const playerName = ref("");
  const isSubmitting = ref(false);

  const onSubmit = async () => {
    if (!playerName.value.trim()) {
      console.warn("Player name is empty or WebSocket is not connected.");
      return;
    }

    isSubmitting.value = true;

    const gameId = route.params.gameId as string;
    socketService.sendJoinGame({ gameId, playerName: playerName.value });
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
  <div>
    <form class="flex max-w-[300px] flex-col" @submit.prevent="onSubmit">
      <h1>Joining game</h1>
      <span>What is your name?</span>

      <input
        v-model="playerName"
        type="text"
        :disabled="isLoading || !socketService.isConnected"
        class="border border-amber-300"
        :maxlength="MAX_PLAYER_NAME_LENGTH"
        minlength="3"
        @input="handleInput"
      />

      <button type="submit" :disabled="isLoading || !socketService.isConnected">
        {{ isLoading ? "loading..." : "join game" }}
      </button>
    </form>
  </div>
</template>
