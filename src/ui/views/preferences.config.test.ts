import { describe, it, expect, vi } from "vitest";

// Mock Webix before importing the module under test to avoid DOM feature checks in webix.js
vi.mock("webix", () => ({
    default: {},
    ui: {},
    extend: () => { },
    ProgressBar: {},
}));

function collectIds(obj: any, out: string[] = []) {
    if (!obj || typeof obj !== "object") return out;
    if (typeof obj.id === "string") out.push(obj.id);
    if (Array.isArray(obj)) obj.forEach(x => collectIds(x, out));
    else {
        for (const k of Object.keys(obj)) {
            collectIds((obj as any)[k], out);
        }
    }
    return out;
}

describe("preferences view config", () => {
    it("contains expected form IDs", async () => {
        const mod = await import("./preferences");
        const cfg = mod.default();
        const ids = collectIds(cfg);
        // Expected IDs used in the module (not exported):
        const expected = [
            "account_settings",
            "notification_settings",
            "privacy_settings",
            "theme_settings",
            "password_change",
        ];
        for (const id of expected) {
            expect(ids).toContain(id);
        }
    });
});
