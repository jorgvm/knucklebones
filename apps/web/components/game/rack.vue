<script lang="ts" setup>
  import type { Rack, RackNumber } from "@shared/types";
  import { twMerge } from "tailwind-merge";

  const { rack, rackNumber, isFinished, canPlay, handlePlaceDie } =
    defineProps<{
      rack: Rack;
      rackNumber: RackNumber;
      isFinished: boolean;
      canPlay: boolean;
      handlePlaceDie: (i: RackNumber) => void;
    }>();

  const isRackFull = () =>
    rack.filter((i) => i.status === "active").length >= 3;

  const isRackDisabled = () => !canPlay || isRackFull();
</script>

<template>
  <div :class="twMerge('relative flex gap-4', isFinished && 'opacity-30')">
    <div
      class="relative flex min-w-6 flex-col overflow-hidden rounded-2xl bg-black/10 p-4"
    >
      <div
        :class="
          twMerge('flex flex-col gap-4 rounded bg-[url(/img/bgr-purple.jpg)]')
        "
      >
        <div v-for="n in 3" :key="n" class="aspect-square size-12 rounded" />
      </div>

      <div class="pointer absolute top-4 left-4 flex flex-col">
        <GameDie
          v-for="die in rack"
          :key="die.id"
          :value="die.value"
          :status="die.status"
        />
      </div>

      <button
        v-if="canPlay"
        type="button"
        class="absolute top-0 left-0 z-10 h-full w-full cursor-pointer bg-red-600 opacity-0 mix-blend-color outline-0 transition-all hover:opacity-100 active:opacity-100 disabled:opacity-0"
        :disabled="isRackDisabled()"
        @click="handlePlaceDie(rackNumber)"
      />
    </div>
  </div>
</template>
