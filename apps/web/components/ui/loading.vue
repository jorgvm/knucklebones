<script setup lang="ts">
  import { twMerge } from "tailwind-merge";
  import { onUnmounted, watch } from "vue";

  const { active } = defineProps<{
    active: boolean;
  }>();

  watch(
    () => active,
    (isActive) => {
      if (typeof document === "undefined") return;

      if (isActive) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    },
    { immediate: true },
  );

  onUnmounted(() => {
    document.body.style.overflow = "";
  });
</script>

<template>
  <div
    :class="
      twMerge(
        'pointer-events-none fixed top-0 left-0 z-50 flex size-full flex-col items-center justify-center gap-2 bg-black opacity-0 transition-opacity duration-500',
        active && 'pointer-events-auto opacity-100',
      )
    "
  >
    <h2 class="relative text-6xl">Loading</h2>
  </div>
</template>
