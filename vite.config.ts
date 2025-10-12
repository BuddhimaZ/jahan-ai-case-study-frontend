import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, ".", "");
    const target = env.VITE_DEV_API_TARGET || "http://localhost:8000";
    return {
        server: {
            proxy: {
                "/api": {
                    target,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    };
});
