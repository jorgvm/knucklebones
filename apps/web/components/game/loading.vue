<script setup lang="ts">
  import { twMerge } from "tailwind-merge";
  import { ref, onMounted, onUnmounted } from "vue";

  const { active } = defineProps<{
    active: boolean;
  }>();

  const dots = ref("");
  let intervalId: ReturnType<typeof setInterval>;

  onMounted(() => {
    // prevent body scroll
    document.body.style.overflow = "hidden";

    // create loading effect
    let count = 0;
    intervalId = setInterval(() => {
      count = (count + 1) % 4;
      dots.value = ".".repeat(count);
    }, 500);
  });

  onUnmounted(() => {
    clearInterval(intervalId);

    // reset body scroll
    document.body.style.overflow = "";
  });
</script>

<template>
  <div
    :class="
      twMerge(
        'pointer-events-none fixed top-0 left-0 z-50 flex size-full items-center justify-center bg-black opacity-0 transition-opacity duration-500',
        active && 'pointer-events-auto opacity-100',
      )
    "
  >
    <h2 class="relative text-6xl">
      Loading
      <span class="absolute -right-2 translate-x-full">{{ dots }}</span>
    </h2>
  </div>
</template>
