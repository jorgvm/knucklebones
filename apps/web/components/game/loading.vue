<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue";

  const dots = ref("");
  let intervalId;

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
  <h2
    class="fixed top-0 left-0 z-50 flex size-full items-center justify-center bg-black text-6xl"
  >
    <span class="relative block">
      Loading
      <span class="absolute -right-2 translate-x-full">{{ dots }}</span>
    </span>
  </h2>
</template>
