<script lang="ts" setup>
  import type { GameData, PlayerId, RackNumber } from "@shared/types";
  import { COOKIE_PLAYER_SECRET_ID } from "@shared/utilities/constants";
  import { getRacks } from "@shared/utilities/get-racks";
  import { twMerge } from "tailwind-merge";
  import type { SocketService } from "~/utilities/socket-service";

  const { playerId, isLocalPlayer } = defineProps<{
    playerId: PlayerId;
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
    gameData.value.players?.find((i) => i.id === playerId),
  );

  const racks = computed(() => {
    if (!player.value) {
      throw new Error("Player data not found");
    }
    return getRacks(player.value.dice);
  });

  // For the player in this player-section, is it the turn to play?
  const myTurn = computed(() => gameData.value.active_player === playerId);
  const canPlay = computed(
    () => isLocalPlayer && myTurn.value && !isLoading.value,
  );

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
      playerId,
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
        'flex flex-col items-center justify-between gap-4',
        isLocalPlayer && 'flex-col-reverse',
      )
    "
  >
    <div v-if="isLocalPlayer" class="absolute top-0 left-0">
      new: {{ gameData.new_die }}
    </div>

    <div class="break-all">
      <span
        class="rounded-2xl border border-neutral-800 bg-purple-950/60 px-4 py-2 text-lg font-semibold uppercase shadow backdrop-blur-md"
      >
        {{ player.name }}
      </span>
    </div>

    <div class="relative flex gap-4">
      <button
        v-for="(rack, index) in racks"
        :key="index"
        class="flex min-w-6 flex-col"
        :disabled="
          !canPlay || rack.filter((i) => i.status === 'active').length >= 3
        "
        @click="() => handlePlaceDie(index)"
      >
        <div class="flex flex-col gap-4">
          <div
            v-for="n in 3"
            :key="n"
            class="aspect-square size-10 rounded bg-black opacity-25"
          />
        </div>

        <div class="absolute top-0 flex flex-col gap-4">
          <GameDie v-for="die in rack" :key="die.id" :die="die" />
        </div>
      </button>
    </div>

    <!-- <div>my score: {{ player.score }}</div>

    {{ canPlay ? "your turn!" : "" }} -->
  </div>
</template>
