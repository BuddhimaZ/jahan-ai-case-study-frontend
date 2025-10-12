import { API_BASE_URL, STORAGE_KEYS } from "../config";
import type { TokenPair, TokenRefresh } from "../types";

let accessToken: string | null = localStorage.getItem(STORAGE_KEYS.access);
let refreshToken: string | null = localStorage.getItem(STORAGE_KEYS.refresh);

export function setTokens(tokens: { access: string; refresh?: string }) {
    accessToken = tokens.access;
    localStorage.setItem(STORAGE_KEYS.access, accessToken);
    if (tokens.refresh) {
        refreshToken = tokens.refresh;
        localStorage.setItem(STORAGE_KEYS.refresh, refreshToken);
    }
}

export function clearTokens() {
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem(STORAGE_KEYS.access);
    localStorage.removeItem(STORAGE_KEYS.refresh);
}

async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken) return false;
    try {
        const res = await fetch(`${API_BASE_URL}/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
        });
        if (!res.ok) return false;
        const data: TokenRefresh = await res.json();
        setTokens({ access: data.access });
        return true;
    } catch {
        return false;
    }
}

// path should start with '/'
export async function http<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };
    if (accessToken) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
    }
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (response.status === 401 && retry && refreshToken) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            return http<T>(path, options, false);
        }
        // refresh failed; clear tokens
        clearTokens();
    }

    if (!response.ok) {
        let detail: any = undefined;
        try {
            detail = await response.json();
        } catch {
            // ignore
        }
        const err = new Error("HTTP Error " + response.status);
        (err as any).status = response.status;
        (err as any).detail = detail;
        throw err;
    }
    // no content
    if (response.status === 204) return undefined as unknown as T;
    return (await response.json()) as T;
}

export async function login(username: string, password: string): Promise<TokenPair> {
    const data = await http<TokenPair>(`/token/`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        // Do not attach Authorization for login
        headers: { "Content-Type": "application/json" },
    });
    setTokens({ access: data.access, refresh: data.refresh });
    return data;
}

export function isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.access);
}
