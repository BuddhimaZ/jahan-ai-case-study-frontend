import { describe, it, expect, vi, beforeEach } from "vitest";
import * as httpMod from "./http";
import {
    getAccount, updateAccount, changePassword,
    getNotifications, updateNotifications,
    getPrivacy, updatePrivacy,
    getTheme, updateTheme,
} from "./me";

const okJson = (data: any) => ({ ok: true, status: 200, json: async () => data } as Response as any);

describe("me.ts API wrappers", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        localStorage.clear();
        httpMod.clearTokens();
    });

    it("calls correct endpoints and methods", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch" as any).mockResolvedValue(okJson({}));

        await getAccount();
        await updateAccount({ username: "x" });
        await changePassword("c", "n");
        await getNotifications();
        await updateNotifications({ email_notifications: true });
        await getPrivacy();
        await updatePrivacy({ data_sharing: false });
        await getTheme();
        await updateTheme({ font_family: "sans-serif" });

        const urls = fetchMock.mock.calls.map(c => c[0] as string);
        const methods = fetchMock.mock.calls.map(c => (c[1] as RequestInit)?.method || "GET");

        expect(urls.some(u => /\/api\/me\/account\/$/.test(u))).toBe(true);
        expect(urls.some(u => /\/api\/me\/account\/change-password\/$/.test(u))).toBe(true);
        expect(urls.some(u => /\/api\/me\/notifications\/$/.test(u))).toBe(true);
        expect(urls.some(u => /\/api\/me\/privacy\/$/.test(u))).toBe(true);
        expect(urls.some(u => /\/api\/me\/theme\/$/.test(u))).toBe(true);

        // order-based checks
        expect(methods).toEqual([
            "GET",    // getAccount
            "PATCH",  // updateAccount
            "POST",   // changePassword
            "GET",    // getNotifications
            "PATCH",  // updateNotifications
            "GET",    // getPrivacy
            "PATCH",  // updatePrivacy
            "GET",    // getTheme
            "PATCH",  // updateTheme
        ]);
    });

    it("sends JSON bodies for PATCH/POST", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch" as any).mockResolvedValue(okJson({}));
        await updateAccount({ email: "a@b.com" });
        await changePassword("old", "new");

        const patchBody = (fetchMock.mock.calls[0][1] as RequestInit).body as string;
        const postBody = (fetchMock.mock.calls[1][1] as RequestInit).body as string;
        expect(JSON.parse(patchBody)).toEqual({ email: "a@b.com" });
        expect(JSON.parse(postBody)).toEqual({ current_password: "old", new_password: "new" });
    });
});
