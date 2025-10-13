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
        <span v-if="isFinished" class="font-mono text-sm">
          ({{ player.score }} {{ player.score === 1 ? "point" : "points" }})
        </span>
      </h1>
    </div>

    <!-- player racks with dice -->
    <div class="relative flex gap-4">
      <div
        v-for="(rack, index) in racks"
        :key="index"
        class="relative flex min-w-6 flex-col overflow-hidden rounded-2xl bg-black/10 p-4"
      >
        <div class="flex flex-col gap-4 rounded bg-[url(/img/bgr-purple.jpg)]">
          <div v-for="n in 3" :key="n" class="aspect-square size-12 rounded" />
        </div>

        <div class="absolute top-4 left-4 flex flex-col">
          <GameDie
            v-for="die in rack"
            :key="die.id"
            :value="die.value"
            :status="die.status"
          />
        </div>

        <button
          v-if="canPlay"
          class="absolute top-0 left-0 h-full w-full cursor-pointer bg-red-600 opacity-0 mix-blend-color transition-all hover:opacity-100 active:opacity-100 disabled:opacity-0"
          :disabled="
            !canPlay || rack.filter((i) => i.status === 'active').length >= 3
          "
          @click="() => handlePlaceDie(index)"
        />
      </div>
    </div>
  </div>
</template>
