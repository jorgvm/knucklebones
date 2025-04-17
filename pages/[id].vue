<template>
  <GameBoard />
</template>

<script setup lang="ts">
import { provide } from "vue";
import type { Dice, GameData } from "~/utilities/types";

const mockDiceList: Dice[] = [
  { status: "ready", value: 4, id: "dice-1-rack-0", rack: 0, player_id: "1" },
  { status: "ready", value: 2, id: "dice-2-rack-0", rack: 0, player_id: "1" },
  { status: "ready", value: 1, id: "dice-2-rack-1", rack: 0, player_id: "1" },
  { status: "ready", value: 6, id: "dice-1-rack-1", rack: 1, player_id: "1" },
  { status: "ready", value: 3, id: "dice-1-rack-2", rack: 2, player_id: "1" },
  { status: "ready", value: 5, id: "dice-2-rack-2", rack: 2, player_id: "1" },
  { status: "ready", value: 1, id: "dice-1-rack-0", rack: 0, player_id: "2" },
  { status: "ready", value: 1, id: "dice-2-rack-0", rack: 0, player_id: "2" },
  { status: "ready", value: 5, id: "dice-2-rack-1", rack: 0, player_id: "2" },
  { status: "ready", value: 6, id: "dice-1-rack-1", rack: 1, player_id: "2" },
  { status: "ready", value: 2, id: "dice-1-rack-2", rack: 2, player_id: "2" },
  { status: "ready", value: 3, id: "dice-2-rack-2", rack: 2, player_id: "2" },
];

// mock
const fetchData = (): GameData => {
  return {
    id: "abc",
    active_player: "1",
    dice_list: mockDiceList,
    players: [
      {
        host: true,
        id: "1",
        name: "john",
      },
      {
        host: false,
        id: "2",
        name: "jane",
      },
    ],
    status: "playing",
    winner: null,
  };
};

const gameData: GameData = fetchData();

provide("gameData", gameData);
</script>
