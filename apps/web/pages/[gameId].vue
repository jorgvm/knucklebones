<script setup lang="ts">
  import { provide } from "vue";
  import type { GameData, ResultJoinGameData } from "@shared/types";
  import {
    COOKIE_PLAYER_ID,
    COOKIE_PLAYER_SECRET_ID,
  } from "@shared/utilities/constants";
  import type { SocketService } from "~/utilities/socket-service";

  const route = useRoute();
  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);
  const cookiePlayerSecretId = useCookie(COOKIE_PLAYER_SECRET_ID);
  const gameId = route.params.gameId.toString();

  const gameDefaults: GameData = {
    created: "",
    new_die: 1,
    status: "loading",
    winner: [],
    players: [],
    version: 1,
    active_player: "",
    secrets: [],
    rematch_id: null,
    latest_actions: [],
    type: "multiplayer",
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

  const localPlayerIsHost = computed(() =>
    Boolean(
      gameData.value.players?.find((i) => i.id === cookiePlayerId.value)?.host,
    ),
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
        // Receive game updates
        socketService.socket.value.on("gameUpdate", (data: GameData) => {
          gameData.value = data;
        });
      }
    },
    { immediate: true },
  );

  const updatePlayerCookies = (data: ResultJoinGameData) => {
    // Handle cookie updates in gameId
    cookiePlayerId.value = data.playerId;
    cookiePlayerSecretId.value = data.playerSecretId;
  };

  // Provider
  provide("gameData", gameData);

  const showLoadingScreen = computed(() => {
    if (gameData.value.status === "not-found") {
      return false;
    }

    const socketIsNotConnected = !socketService.isConnected.value;
    const gameStatusIsLoading = gameData.value.status === "loading";

    return socketIsNotConnected || gameStatusIsLoading;
  });
</script>

<template>
  <UiLoading :active="showLoadingScreen" />

  <div v-if="!showLoadingScreen">
    <GameLobby v-if="gameData.status === 'lobby'" />

    <GameBoard
      v-if="
        playerIsInGame &&
        (gameData.status === 'playing' || gameData.status === 'finished')
      "
    />

    <GameJoinGameForm
      v-if="
        gameData.status === 'lobby' && !localPlayerIsHost && !playerIsInGame
      "
      :update-player-cookies="updatePlayerCookies"
    />

    <GameNotFound
      v-if="
        gameData.status === 'not-found' ||
        (gameData.status !== 'lobby' && !playerIsInGame)
      "
    />
  </div>
</template>
