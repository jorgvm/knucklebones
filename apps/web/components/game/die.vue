<script lang="ts" setup>
  import type { DieStatus } from "@shared/types";
  import { twMerge } from "tailwind-merge";

  const { value, status = "active" } = defineProps<{
    value: number;
    status?: DieStatus;
  }>();

  const iconName = "nrk:dice-" + value;
</script>

<template>
  <div
    :class="
      twMerge(
        'mb-4 flex size-14 scale-110 items-center justify-center overflow-hidden bg-[url(img/die.png)] bg-cover text-black opacity-100 transition-all duration-500',
        status === 'removed' && 'mb-0 h-0',
      )
    "
  >
    <Icon :name="iconName" size="3.5em" class="opacity-80" />
  </div>
</template>
