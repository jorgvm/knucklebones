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

  const serverError = JSON.parse(error.data)?.message;

  const handleClearError = () => clearError({ redirect: "/" });
</script>

<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="aspect-square min-w-[260px] p-12 shadow">
      <h1>Oops, something went wrong</h1>

      <p>
        {{ serverError }}
      </p>

      <button class="my-7" @click="handleClearError">Go home</button>
    </div>
  </div>
</template>
