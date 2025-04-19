<script lang="ts" setup>
  const { handleContinue } = defineProps<{ handleContinue: () => void }>();
</script>

<template>
  <div>
    It's been a while, are you still playing the game?

    <button @click="handleContinue">Continue</button>
  </div>
</template>
