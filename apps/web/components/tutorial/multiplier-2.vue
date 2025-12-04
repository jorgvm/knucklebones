<script lang="ts" setup>
  import type { Rack } from "@shared/types";

  const racksOpponent: Rack[] = [[], [], []];

  const racks: Rack[] = [
    [
      {
        created: "",
        id: "",
        rack: 0,
        status: "active",
        value: 5,
      },
      {
        created: "",
        id: "",
        rack: 0,
        status: "active",
        value: 5,
      },
      {
        created: "",
        id: "",
        rack: 0,
        status: "active",
        value: 5,
      },
    ],
    [],
    [],
  ];
</script>

<template>
  <div>
    <div class="-mt-12 -mb-10 scale-75">
      <h1
        class="gap-4 text-center text-red-500 uppercase text-shadow-md text-shadow-red-500"
      >
        opponent
        <span class="font-mono text-sm"> 0 points </span>
      </h1>

      <div class="flex justify-center">
        <GameRack
          v-for="(rack, index) in racksOpponent"
          :key="index"
          :rack="rack"
          :rack-number="index"
          :can-play="false"
          :is-finished="false"
          :handle-place-die="() => null"
        />
      </div>

      <div class="flex justify-center">
        <GameRack
          v-for="(rack, index) in racks"
          :key="index"
          :rack="rack"
          :rack-number="index"
          :can-play="false"
          :is-finished="false"
          :handle-place-die="() => null"
        />
      </div>

      <h1
        class="gap-4 text-center text-red-500 uppercase text-shadow-md text-shadow-red-500"
      >
        you
        <span class="font-mono text-sm"> 45 points </span>
      </h1>
    </div>

    <div>
      <div class="font-normal">The same dice in one column multiply!</div>
      <p>
        <span class="font-clear"
          >5&times;3 + 5&times;3 + 5&times;3 = 45 points</span
        >
      </p>
    </div>
  </div>
</template>
