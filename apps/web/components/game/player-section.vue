<script lang="ts" setup>
  import type { GameData, PlayerId } from "@shared/types";
  import { getRacks } from "@shared/utilities/get-racks";

  const { playerId, isLocalPlayer } = defineProps<{
    playerId: PlayerId;
    isLocalPlayer: boolean;
  }>();

  const route = useRoute();

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
  const handlePlaceDie = async (rackNumber: number) => {
    isLoading.value = true;
    const { gameId } = route.params;

    await $fetch("/api/place-die", {
      method: "post",
      body: { gameId, playerId, rackNumber },
    });
  };
</script>

<template>
  <div v-if="player">
    <div v-if="isLocalPlayer">new: {{ gameData.new_die }}</div>
    <div>{{ player.name }}</div>
    <div class="flex">
      <button
        v-for="(rack, index) in racks"
        :key="index"
        class="flex min-h-20 flex-col border border-amber-900 p-4"
        :disabled="
          !canPlay || rack.filter((i) => i.status === 'active').length >= 3
        "
        @click="() => handlePlaceDie(index)"
      >
        <GameDice v-for="die in rack" :key="die.id" :die="die" />
      </button>
    </div>

    <div>my score: {{ player.score }}</div>

    {{ canPlay ? "your turn!" : "" }}
  </div>
</template>
