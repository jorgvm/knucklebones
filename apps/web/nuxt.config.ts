import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Knucklebones",
    },
  },
  alias: {
    "@shared": path.resolve(__dirname, "../../packages/shared/src"),
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          "Metal Mania": true,
          Lacquer: true,
        },
        display: "swap",
      },
    ],
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      gameServerUrl: process.env.GAME_SERVER_URL,
    },
  },
});
