<script setup lang="ts">
  import { computed } from "vue";
  import { twMerge } from "tailwind-merge";

  const { className = "" } = defineProps<{
    className?: string;
  }>();

  const baseClasses = computed(() =>
    twMerge(
      "max-w-[400px] rounded-3xl border-8 border-black/10 bg-black p-8 flex flex-col gap-4",
      className,
    ),
  );
</script>

<template>
  <div :class="baseClasses">
    <slot />
  </div>
</template>
