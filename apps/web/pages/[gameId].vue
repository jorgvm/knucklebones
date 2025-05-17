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

  const playerIsInGame = computed(() =>
    gameData.value.players.some((i) => i.id === cookiePlayerId.value),
  );

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

  // Provider
  provide("gameData", gameData);

  const showLoadingScreen = computed(() => {
    // There might be a brief moment where the game has started, but the id cookie is not set, in that case, show the loading screen
    // This will also hide the game for players that not in the game
    const playerIsNotInGame =
      !playerIsInGame.value && gameData.value.status === "playing";
    const socketIsNotConnected = !socketService.isConnected.value;
    const gameStatusIsLoading = gameData.value.status === "loading";

    return playerIsNotInGame || socketIsNotConnected || gameStatusIsLoading;
  });
</script>

<template>
  <GameLoading v-if="showLoadingScreen" />

  <div v-if="!showLoadingScreen">
    <GameBoard
      v-if="gameData.status === 'playing' || gameData.status === 'finished'"
    />

    <GameLobby v-if="gameData.status === 'lobby'" />

    <div v-if="gameData.status === 'finished'">Winner!</div>
  </div>
</template>
