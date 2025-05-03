import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Your existing test configurations
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "."), // Maps ~ to the project root
    },
  },
});
