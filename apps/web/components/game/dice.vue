<script lang="ts" setup>
  import type { Die } from "@shared/types";
  import { twMerge } from "tailwind-merge";

  const { die } = defineProps<{ die: Die }>();
</script>

<template>
  <div
    :class="
      twMerge(
        'text-center text-2xl opacity-100 transition-opacity duration-500',
        die.status === 'removed' && 'opacity-0',
      )
    "
  >
    {{ die.value }}
  </div>
</template>
