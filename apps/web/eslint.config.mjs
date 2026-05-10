// @ts-check
import { fileURLToPath } from "node:url";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  rules: {
    "no-undef": "error",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "vue/block-lang": [
      "error",
      {
        script: {
          // make sure lang=ts is set on script tags, to enforce ts
          lang: "ts",
        },
      },
    ],
    "vue/html-self-closing": [
      "error",
      {
        html: {
          // Allows self-closing for void elements like <input />, to avoid conflict with prettier
          void: "any",
          normal: "always",
          component: "always",
        },
      },
    ],
    // Make sure <script> indents, for readability
    "vue/script-indent": [
      "error",
      2,
      {
        baseIndent: 1,
      },
    ],
    "vue/no-multiple-template-root": "off", // in vue3 we don't need a root
    "no-shadow": "error", // dont allow shadow value names
  },
});
