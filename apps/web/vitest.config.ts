import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {},
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "."), // Maps ~ to the project root
      "@shared": path.resolve(__dirname, "../../packages/shared/src"),
    },
  },
});
