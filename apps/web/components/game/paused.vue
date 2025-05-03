<script lang="ts" setup>
  const { handleContinue } = defineProps<{ handleContinue: () => void }>();
</script>

<template>
  <div class="my-3 opacity-30">
    It has been a while, are you still playing the game?

    <button @click="handleContinue">Continue</button>
  </div>
</template>
