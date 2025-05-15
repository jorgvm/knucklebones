<script setup lang="ts">
  import { provide } from "vue";
  import type { GameData } from "@shared/types";
  import { COOKIE_PLAYER_ID } from "@shared/utilities/constants";
  import type { SocketService } from "~/utilities/socket-service";

  const route = useRoute();
  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);
  const gameId = route.params.gameId.toString();

  const gameDefaults: GameData = {
    id: "",
    created: "",
    new_die: 1,
    status: "loading",
    winner: "",
    players: [],
    version: 1,
    active_player: "",
  };

  const gameData: Ref<GameData> = ref(gameDefaults);

  // Socket
  const socketService = inject<SocketService>("socketService");
  if (!socketService) {
    throw new Error("Socket service not defined");
  }

  const isConnected = computed(() => socketService.isConnected.value);

  onMounted(() => {
    // Subscribe to the game when the component mounts and the socket is connected
    if (isConnected.value && gameId) {
      socketService.sendSubscribeToGame({ gameId: gameId });
    }
  });

  watch(isConnected, (newIsConnected) => {
    if (newIsConnected && gameId) {
      // Re-subscribe when the socket reconnects

      socketService.sendSubscribeToGame({ gameId: gameId });
    }
  });

  // Listen for socket events using the injected socketService
  watch(
    () => socketService.socket.value,
    () => {
      if (socketService.socket.value) {
        socketService.socket.value.on("gameUpdate", (data: GameData) => {
          gameData.value = data;
        });

        socketService.socket.value.on(
          "joinGameResult",
          (data: { playerId: string }) => {
            cookiePlayerId.value = data.playerId;
          },
        );
      }
    },
    { immediate: true },
  );

  // Redirect if player is not part of the game, and status is not lobby or loading
  watch(
    gameData,
    (newGameData) => {
      const player = newGameData.players.find(
        (i) => i.id === cookiePlayerId.value,
      );

      if (!player && !["lobby", "loading"].includes(gameData.value.status)) {
        console.error("User is not part of this game");
        // todo
        // router.replace("/wrong-game");
      }
    },
    { immediate: true },
  );

  // Provider
  provide("gameData", gameData);
</script>

<template>
  <div v-if="gameData.status === 'loading'">loading...</div>

  <GameBoard
    v-if="gameData.status === 'playing' || gameData.status === 'finished'"
  />
  <GameLobby v-if="gameData?.status === 'lobby'" />

  {{ gameData.status === "finished" ? "We have a winner" : "" }}

  <GameLoading v-if="!socketService.isConnected.value" />
</template>
