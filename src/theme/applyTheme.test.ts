import { describe, it, expect, beforeEach } from "vitest";
import { applyTheme } from "./applyTheme";

describe("applyTheme", () => {
    beforeEach(() => {
        document.documentElement.style.cssText = "";
    });
    it("sets CSS variables when provided", () => {
        applyTheme({
            user: 1,
            primary_color: "#111111",
            secondary_color: "#222222",
            font_primary_color: "#333333",
            font_secondary_color: "#444444",
            font_family: "Arial",
        } as any);
        const s = getComputedStyle(document.documentElement);
        expect(s.getPropertyValue("--color-primary").trim()).toBe("#111111");
        expect(s.getPropertyValue("--font-family").trim()).toBe("Arial");
    });
});
