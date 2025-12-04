<script lang="ts" setup>
  import type { Rack } from "@shared/types";

  const racksOpponent: Rack[] = reactive([[], [], []]);
  const racks: Rack[] = reactive([[], [], []]);

  const runAnimation = () => {
    // Step 1: Add three dice to opponent (3, 2, 2)
    setTimeout(() => {
      racksOpponent[0].push(
        {
          created: "",
          id: "0",
          rack: 0,
          status: "active",
          value: 3,
        },
        {
          created: "",
          id: "1",
          rack: 0,
          status: "active",
          value: 2,
        },
        {
          created: "",
          id: "2",
          rack: 0,
          status: "active",
          value: 2,
        },
      );

      racksOpponent[1].push({
        created: "",
        id: "0",
        rack: 1,
        status: "active",
        value: 2,
      });

      // Step 2: Add one die to player and mark opponent 2's as removed
      setTimeout(() => {
        racks[0].push({
          created: "",
          id: "3",
          rack: 0,
          status: "active",
          value: 2,
        });

        racksOpponent[0].forEach((die) => {
          if (die.value === 2) {
            die.status = "removed";
          }
        });

        // Step 3: Clear board completely
        setTimeout(() => {
          racks[0] = [];
          racksOpponent[0] = [];
          racksOpponent[1] = [];

          // Step 4: Wait 1 second and start over
          setTimeout(() => {
            runAnimation();
          }, 1000);
        }, 3000);
      }, 2000);
    }, 0);
  };

  onMounted(() => {
    runAnimation();
  });
</script>

<template>
  <div>
    <div class="-mt-12 -mb-10 scale-75">
      <h1
        class="gap-4 text-center text-red-500 uppercase text-shadow-md text-shadow-red-500"
      >
        opponent
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
      </h1>
    </div>

    <div>Remove dice in the same column!</div>
  </div>
</template>
