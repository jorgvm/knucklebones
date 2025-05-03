<script lang="ts" setup>
  import { ref, onMounted } from "vue";
  import {
    COOKIE_PLAYER_ID,
    MAX_PLAYER_NAME_LENGTH,
  } from "@shared/utilities/constants";
  import { sanitizeName } from "@shared/utilities/sanitise";

  import { useRoute, useRouter, useCookie } from "nuxt/app";
  import { useSocketIO } from "~/utilities/use-socket";
  import type { GameId, PlayerId } from "@shared/types";

  const { type } = defineProps<{
    type: "join-game" | "create-game";
  }>();

  const playerName = ref("");
  const isLoading = ref(false);
  const { isConnected, socket, sendCreateGame, sendJoinGame } = useSocketIO();
  const router = useRouter();
  const route = useRoute();
  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);

  onMounted(() => {
    console.log("um", socket.value);
    if (socket.value) {
      socket.value.on("createGameResult", (data) => {
        const { playerId, gameId }: { playerId: PlayerId; gameId: GameId } =
          data;

        console.log("data", data);

        cookiePlayerId.value = playerId;
        isLoading.value = false;
        router.push("/" + gameId);
      });

      socket.value.on("gameJoined", (data: { playerId: string }) => {
        cookiePlayerId.value = data.playerId;
        isLoading.value = false;
      });

      socket.value.on("gameError", (error: string) => {
        console.error("Game error:", error);
        isLoading.value = false;
      });
    }
  });

  const onSubmit = async () => {
    if (!playerName.value.trim() || !isConnected.value || !socket.value) {
      console.warn("Player name is empty or WebSocket is not connected.");
      return;
    }

    isLoading.value = true;

    if (type === "create-game") {
      sendCreateGame(playerName.value);
    } else {
      sendJoinGame(route.params.gameId as string, playerName.value);
    }
  };

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    playerName.value = sanitizeName(input.value);
  };
</script>

<template>
  <div>
    <form class="flex max-w-[300px] flex-col" @submit.prevent="onSubmit">
      <span>What is your name?</span>

      <input
        v-model="playerName"
        type="text"
        :disabled="isLoading || !isConnected"
        class="border border-amber-300"
        :maxlength="MAX_PLAYER_NAME_LENGTH"
        minlength="3"
        @input="handleInput"
      />

      <button type="submit" :disabled="isLoading || !isConnected">
        {{
          isLoading
            ? "loading..."
            : type === "create-game"
              ? "create game"
              : "join game"
        }}
      </button>

      <div v-if="!isConnected" class="mt-2 text-red-500">
        Connecting to server...
      </div>
    </form>
  </div>
</template>
