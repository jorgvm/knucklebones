<script lang="ts" setup>
  import type { DieStatus } from "@shared/types";
  import { twMerge } from "tailwind-merge";

  const {
    value,
    status = "active",
    className = "",
  } = defineProps<{
    className?: string;
    value: number;
    status?: DieStatus;
  }>();

  // Keep track of removed state, so we dont show remove animation upon refresh
  const isRemovedLocalState = ref(false);

  onMounted(() => {
    isRemovedLocalState.value = false;
  });

  watch(
    () => status,
    (newStatus) => {
      if (newStatus === "removed") {
        isRemovedLocalState.value = true;
      }
    },
    { immediate: true },
  );
</script>

<template>
  <div
    data-testid="die"
    :data-value="value"
    :data-status="status"
    :class="
      twMerge(
        'mb-4 flex size-12 scale-110 items-center justify-center overflow-hidden bg-[url(img/die.png)] bg-cover text-black transition-all',
        !isRemovedLocalState && status === 'removed' && 'mb-0 h-0',
        isRemovedLocalState && 'animate-remove',
        className,
      )
    "
  >
    <Icon :name="'nrk:dice-' + value" size="3.5em" class="opacity-80" />
  </div>
</template>
