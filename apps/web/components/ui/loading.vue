<script setup lang="ts">
  import { twMerge } from "tailwind-merge";
  import { ref, onUnmounted, watch } from "vue";

  const { active } = defineProps<{
    active: boolean;
  }>();

  const serverIsSlow = ref(false);
  let timeout: ReturnType<typeof setTimeout>;

  watch(
    () => active,
    (isActive) => {
      if (isActive) {
        if (typeof document !== "undefined") {
          // prevent body scroll
          document.body.style.overflow = "hidden";
        }

        // if server is taking too long, show a message
        timeout = setTimeout(() => {
          serverIsSlow.value = true;
        }, 2000);
      } else {
        if (timeout) {
          clearTimeout(timeout);
        }
        serverIsSlow.value = false;
        if (typeof document !== "undefined") {
          document.body.style.overflow = "";
        }
      }
    },
    { immediate: true },
  );

  onUnmounted(() => {
    clearTimeout(timeout);

    // reset body scroll
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

    <p v-if="serverIsSlow" class="text-center">
      Hmm, the server is slow. If it's a cold start, this make take a minute.
    </p>
  </div>
</template>
