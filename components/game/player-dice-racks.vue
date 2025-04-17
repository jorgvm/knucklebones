<template>
  <div className="flex">
    <div v-for="(rack, index) in racks" :key="index" class="flex flex-col p-4">
      <div v-for="dice in rack" :key="dice.id">
        {{ dice.value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { inject } from "vue";
  import type { GameData, PlayerId, Racks } from "~/utilities/types";

  const gameData = inject("gameData") as GameData;

  const { playerId } = defineProps<{
    playerId: PlayerId;
  }>();

  const myDice = gameData.dice_list.filter((dice) => dice.player_id === playerId);

  const racks: Racks = [[], [], []];

  myDice.forEach((dice) => {
    racks[dice.rack].push(dice);
  });
</script>
