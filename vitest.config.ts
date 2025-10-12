import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "happy-dom",
        coverage: { provider: "v8" },
        globals: true,
    },
});
