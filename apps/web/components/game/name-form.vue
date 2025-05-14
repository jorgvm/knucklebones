<script lang="ts" setup>
  import { ref } from "vue";
  import {
    COOKIE_PLAYER_ID,
    MAX_PLAYER_NAME_LENGTH,
  } from "@shared/utilities/constants";
  import { sanitizeName } from "@shared/utilities/sanitise";

  import { useRoute, useRouter, useCookie } from "nuxt/app";

  import type { GameId, PlayerId } from "@shared/types";

  const { type } = defineProps<{
    type: "join-game" | "create-game";
  }>();

  const playerName = ref("");
  const isLoading = ref(false);
  const router = useRouter();
  const route = useRoute();
  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);

  const socketService = inject(
    "socketService",
  ) as typeof import("../../utilities/socket-service").socketService;

  const onSubmit = async () => {
    if (!playerName.value.trim()) {
      console.warn("Player name is empty or WebSocket is not connected.");
      return;
    }

    isLoading.value = true;

    if (type === "create-game") {
      socketService.sendCreateGame({ playerName: playerName.value });
    } else {
      const gameId = route.params.gameId as string;
      socketService.sendJoinGame({ gameId, playerName: playerName.value });
    }
  };

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    playerName.value = sanitizeName(input.value);
  };

  watch(
    () => socketService.socket.value,
    (newSocket) => {
      if (newSocket) {
        newSocket.on("createGameResult", (data) => {
          const { playerId, gameId }: { playerId: PlayerId; gameId: GameId } =
            data;

          cookiePlayerId.value = playerId;
          isLoading.value = false;
          router.push("/" + gameId);
        });
      }
    },
  );
</script>

<template>
  <div>
    <form class="flex max-w-[300px] flex-col" @submit.prevent="onSubmit">
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
        {{
          isLoading
            ? "loading..."
            : type === "create-game"
              ? "create game"
              : "join game"
        }}
      </button>
    </form>
  </div>
</template>
