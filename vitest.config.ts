import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: import.meta.dirname,
    include: ["api/**/*.test.ts"],
    environment: "node",
  },
});
