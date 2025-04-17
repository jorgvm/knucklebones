<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="aspect-square min-w-[260px] p-12 shadow">
      <h1>Error</h1>

      <p>Oops something went wrong</p>

      <p>
        {{ error }}
      </p>

      <button class="my-7" @click="handleClearError">Go home</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: false,
  });

  const { error } = defineProps({
    error: {
      type: Object,
      required: true,
    },
  });

  const handleClearError = () => clearError({ redirect: "/" });
</script>
