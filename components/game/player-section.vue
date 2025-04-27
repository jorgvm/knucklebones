<script lang="ts" setup>
  import type { Dice, GameData, PlayerId, Racks } from "~/utilities/types";

  const generateRacks = (dice: Dice[]) => {
    const defaultRacks = [[], [], []] as Racks;

    const result = dice.reduce((acc, dice) => {
      acc[dice.rack] = [...(acc[dice.rack] || []), dice];
      return acc;
    }, defaultRacks);

    return result;
  };

  const { playerId, isLocalPlayer } = defineProps<{
    playerId: PlayerId;
    isLocalPlayer: boolean;
  }>();

  const route = useRoute();
  const isLoading = ref(false);

  const gameData = inject<Ref<GameData>>("gameData");

  if (!gameData?.value) {
    throw new Error("GameData was not provided");
  }

  const handlePlaceDice = async (rackNumber: number) => {
    isLoading.value = true;
    const { gameId } = route.params;

    await $fetch("/api/place-dice", {
      method: "post",
      body: { gameId, playerId, rackNumber },
    });

    isLoading.value = false; // todo, loading should be defined by succesfull new game fetch
  };

  const localPlayer = computed(() =>
    gameData.value.players?.find((i) => i.id === playerId),
  );

  const myDice = computed(() =>
    gameData.value.dice_list.filter((dice) => dice.player_id === playerId),
  );

  const racks = computed(() => generateRacks(myDice.value));

  const myTurn = computed(() => gameData.value.active_player === playerId);
  const canPlay = computed(() => isLocalPlayer && myTurn);
</script>

<template>
  <div v-if="localPlayer" class="">
    {{ isLocalPlayer && myTurn ? "My turn" : null }}

    <div>{{ localPlayer.name }}</div>
    <div class="flex">
      <button
        v-for="(rack, index) in racks"
        :key="index"
        class="flex min-h-20 flex-col border border-amber-900 p-4"
        :disabled="!canPlay"
        @click="() => handlePlaceDice(index)"
      >
        <div v-for="dice in rack" :key="dice.id">
          {{ dice.value }}
        </div>
      </button>
    </div>
  </div>
</template>
