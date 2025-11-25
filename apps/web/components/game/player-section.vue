<script lang="ts" setup>
  import type { GameData, PlayerId, RackNumber } from "@shared/types";
  import { COOKIE_PLAYER_SECRET_ID } from "@shared/utilities/constants";
  import { getRacks } from "@shared/utilities/get-racks";
  import { twMerge } from "tailwind-merge";
  import type { SocketService } from "~/utilities/socket-service";

  const { sectionPlayerId, isLocalPlayer } = defineProps<{
    sectionPlayerId: PlayerId;
    isLocalPlayer: boolean;
  }>();

  const cookiePlayerSecretId = useCookie(COOKIE_PLAYER_SECRET_ID);

  const route = useRoute();

  // Socket
  const socketService = inject<SocketService>("socketService");
  if (!socketService) {
    throw new Error("Socket service not defined");
  }

  // Keep track of loading locally, to prevent multiple place-die requests to server
  const isLoading = ref(false);

  const gameData = inject<Ref<GameData>>("gameData");
  if (!gameData?.value) {
    throw new Error("GameData was not provided");
  }

  const player = computed(() =>
    gameData.value.players?.find((i) => i.id === sectionPlayerId),
  );

  const racks = computed(() => {
    if (!player.value) {
      throw new Error("Player data not found");
    }
    return getRacks(player.value.dice);
  });

  // For the player in this player-section, is it the turn to play?
  const myTurn = computed(
    () => gameData.value.active_player === sectionPlayerId,
  );

  // You can only make a move for yourself
  const canPlay = computed(
    () => isLocalPlayer && myTurn.value && !isLoading.value,
  );

  const isFinished = computed(() => gameData.value.status === "finished");

  watch(gameData, () => {
    // After making a move and new data is fetched, set loading to false
    isLoading.value = false;
  });

  // Player selects which rack to place die in
  const handlePlaceDie = async (rackNumber: RackNumber) => {
    isLoading.value = true;
    const { gameId } = route.params;

    socketService.sendPlaceDie({
      gameId: gameId.toString(),
      playerId: sectionPlayerId,
      playerSecretId: String(cookiePlayerSecretId.value),
      rackNumber,
    });
  };
</script>

<template>
  <div
    v-if="player"
    :class="
      twMerge(
        'flex flex-col items-center justify-between gap-1 transition-all duration-500',
        isLocalPlayer && 'flex-col-reverse',
        !isFinished && !myTurn && 'brightness-50',
      )
    "
  >
    <!-- player name and score -->
    <div class="relative z-10">
      <h1
        :class="
          twMerge(
            'flex items-center gap-4 text-red-500 uppercase text-shadow-md text-shadow-red-500',
            myTurn && '',
          )
        "
      >
        {{ player.name }}
        <span class="font-mono text-sm">
          ({{ player.score }} {{ player.score === 1 ? "point" : "points" }})
        </span>
      </h1>
    </div>

    <!-- player racks with dice -->
    <div class="relative flex gap-4">
      <GameRack
        v-for="(rack, index) in racks"
        :key="index"
        :rack="rack"
        :rack-number="index"
        :can-play="canPlay"
        :is-finished="isFinished"
        :handle-place-die="handlePlaceDie"
      />
    </div>
  </div>
</template>
