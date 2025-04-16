<template>
  <div class="flex items-center justify-center w-full h-full">
    <div class="shadow p-12 aspect-square min-w-[260px]">
      <h1>Error</h1>

      <p>Oops something went wrong</p>

      <button @click="handleClearError" class="my-7">Go home</button>
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
