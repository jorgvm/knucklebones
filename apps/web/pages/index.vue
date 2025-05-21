<script lang="ts" setup>
  import socketService from "~/utilities/socket-service";
</script>

<template>
  <div class="flex h-svh min-h-[667px] items-center">
    <div class="box w-full">
      <div class="flex flex-col gap-4">
        <h1 class="uppercase">Knucklesbones</h1>
        <RouterLink to="/create" class="button">Create game</RouterLink>
        <RouterLink to="/tutorial" class="button">Tutorial</RouterLink>
      </div>
    </div>
  </div>

  <GameLoading v-if="!socketService.isConnected.value" />
</template>
