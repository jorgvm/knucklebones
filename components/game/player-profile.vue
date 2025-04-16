<template>player #{{ playerId }}</template>

<script lang="ts" setup>
import type { PlayerId } from "~/utilities/types";

const { playerId } = defineProps<{
  playerId: PlayerId;
}>();
</script>
