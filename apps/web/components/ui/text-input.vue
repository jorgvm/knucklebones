<template>
  <div>
    <span class="mb-4 block">{{ label }}</span>
    <input
      class="w-full rounded border-4 border-[#29103c] bg-black px-4 py-2 active:outline-amber-950"
      v-bind="$attrs"
    />
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    label?: string;
  }>();
</script>
