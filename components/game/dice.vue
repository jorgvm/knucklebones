<script lang="ts" setup>
  import type { Dice } from "~/utilities/types";
  import { twMerge } from "tailwind-merge";

  const { dice } = defineProps<{ dice: Dice }>();
</script>

<template>
  <div
    :class="
      twMerge(
        'text-center text-2xl transition-opacity duration-500',
        dice.status === 'removed' ? 'opacity-0' : 'opacity-100',
      )
    "
  >
    {{ dice.value }}
  </div>
</template>
