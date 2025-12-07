<script setup lang="ts">
  import {
    COOKIE_PLAYER_ID,
    COOKIE_PLAYER_NAME,
    COOKIE_PLAYER_SECRET_ID,
  } from "@shared/utilities/constants";

  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);
  const cookiePlayerName = useCookie(COOKIE_PLAYER_NAME);
  const cookiePlayerSecretId = useCookie(COOKIE_PLAYER_SECRET_ID);

  definePageMeta({
    layout: false,
  });

  const handleClearError = () => {
    // Remove cookies
    cookiePlayerId.value = null;
    cookiePlayerSecretId.value = null;
    cookiePlayerName.value = null;

    return clearError({ redirect: "/" });
  };
</script>

<template>
  <div class="flex h-full w-full items-center justify-center text-white">
    <div class="aspect-square min-w-[260px] p-12 shadow">
      <UiBox>
        <h1>Oops, something went wrong</h1>

        <p class="">Please refresh. If the error remains, you can reset:</p>

        <UiButton class="my-7" @click="handleClearError">Reset</UiButton>
      </UiBox>
    </div>
  </div>
</template>
