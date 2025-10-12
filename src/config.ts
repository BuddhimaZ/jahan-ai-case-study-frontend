// Centralized runtime configuration
// Default: use current origin + /api (production domain will be jahanai.buddhima-zoysa.bio)
export const API_BASE_URL = ((): string => {
    const envUrl = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
    if (envUrl) return envUrl.replace(/\/$/, "");
    const origin = window.location.origin;
    return `${origin}/api`;
})();

export const STORAGE_KEYS = {
    access: "auth.access",
    refresh: "auth.refresh",
};
