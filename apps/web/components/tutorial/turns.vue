<script lang="ts" setup>
  import type { Rack } from "@shared/types";

  const racksOpponent: Rack[] = [
    [
      {
        created: "",
        id: "",
        rack: 0,
        status: "active",
        value: 1,
      },
      {
        created: "",
        id: "",
        rack: 0,
        status: "active",
        value: 3,
      },
    ],
    [],
    [],
  ];

  const racks: Rack[] = [
    [
      {
        created: "",
        id: "",
        rack: 0,
        status: "active",
        value: 2,
      },
    ],
    [
      {
        created: "",
        id: "",
        rack: 0,
        status: "active",
        value: 4,
      },
      {
        created: "",
        id: "",
        rack: 0,
        status: "active",
        value: 2,
      },
    ],
    [],
  ];
</script>

<template>
  <div>
    <div class="-mt-10 -mb-10 scale-75">
      <h1
        class="gap-4 text-center text-red-500 uppercase text-shadow-md text-shadow-red-500"
      >
        opponent
        <span class="font-mono text-sm"> 4 points </span>
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
        <span class="font-mono text-sm"> 6 points </span>
      </h1>
    </div>

    <p>Players take turns placing dice</p>

    <p><span class="font-clear">2 + 4 + 2 = 6 points</span></p>
  </div>
</template>
