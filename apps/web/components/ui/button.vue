<script setup lang="ts">
  import { computed } from "vue";
  import { RouterLink } from "vue-router";
  import { twMerge } from "tailwind-merge";

  const {
    className = "",
    type = "button",
    to = "",
    small = false,
  } = defineProps<{
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    to?: string;
    className?: string;
    small?: boolean;
  }>();

  const baseClasses = computed(() =>
    twMerge(
      "bg-purple-dark bg-[url('/img/bgr-purple.jpg')] bg-no-repeat bg-[position:0_0]",
      "text-center text-white block cursor-pointer rounded-xl border-3 border-[#29103c] bg-cover px-6 py-3 text-2xl hover:border-white/50 active:translate-y-0.5 disabled:cursor-not-allowed",
      small && "px-2 text-xl py-1",
      className,
    ),
  );
</script>

<template>
  <component
    :is="to ? RouterLink : 'button'"
    :type="to ? undefined : type"
    :disabled="to ? undefined : disabled"
    :to="to"
    :class="baseClasses"
  >
    <slot />
  </component>
</template>
