import { describe, it, expect, vi, beforeEach } from "vitest";

// Use actual module to test behavior; mock fetch
import * as httpMod from "./http";

const okJson = (data: any) => ({ ok: true, status: 200, json: async () => data } as Response as any);
const errJson = (status: number, data?: any) => ({ ok: false, status, json: async () => data ?? { detail: "err" } } as Response as any);

describe("http client", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        localStorage.clear();
        // reset tokens within module
        httpMod.clearTokens();
    });

    it("login stores tokens and returns payload", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch" as any).mockResolvedValueOnce(okJson({ access: "A", refresh: "R" }));
        const data = await httpMod.login("u", "p");
        expect(data).toEqual({ access: "A", refresh: "R" });
        expect(localStorage.getItem("auth.access")).toBe("A");
        expect(localStorage.getItem("auth.refresh")).toBe("R");
        expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/token\/$/), expect.objectContaining({ method: "POST" }));
    });

    it("adds Authorization header when access token set", async () => {
        httpMod.setTokens({ access: "TOKEN" });
        const fetchMock = vi.spyOn(globalThis, "fetch" as any).mockResolvedValueOnce(okJson({ foo: 1 }));
        await httpMod.http("/me/account/");
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const options = fetchMock.mock.calls[0][1] as RequestInit;
        expect(((options.headers as any) || {})["Authorization"]).toBe("Bearer TOKEN");
    });

    it("refreshes on 401 and retries with new token", async () => {
        httpMod.setTokens({ access: "OLD", refresh: "REF" });
        const fetchMock = vi.spyOn(globalThis, "fetch" as any)
            // first attempt -> 401
            .mockResolvedValueOnce(errJson(401))
            // refresh token -> 200 with new access
            .mockResolvedValueOnce(okJson({ access: "NEW" }))
            // retried call -> 200
            .mockResolvedValueOnce(okJson({ ok: true }));

        const res = await httpMod.http<{ ok: boolean }>("/me/account/");
        expect(res.ok).toBe(true);

        // calls: 1) original, 2) refresh, 3) retry
        expect(fetchMock).toHaveBeenCalledTimes(3);

        const refreshCallUrl = fetchMock.mock.calls[1][0] as string;
        expect(refreshCallUrl).toMatch(/\/token\/refresh\/$/);

        const retryOptions = fetchMock.mock.calls[2][1] as RequestInit;
        expect(((retryOptions.headers as any) || {})["Authorization"]).toBe("Bearer NEW");
    });

    it("clears tokens and throws when refresh fails", async () => {
        httpMod.setTokens({ access: "OLD", refresh: "REF" });
        const fetchMock = vi.spyOn(globalThis, "fetch" as any)
            // first attempt -> 401
            .mockResolvedValueOnce(errJson(401))
            // refresh fails -> 401
            .mockResolvedValueOnce(errJson(401));

        await expect(httpMod.http("/me/account/")).rejects.toBeInstanceOf(Error);
        expect(localStorage.getItem("auth.access")).toBeNull();
        expect(localStorage.getItem("auth.refresh")).toBeNull();
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});
