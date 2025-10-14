import { describe, it, expect, beforeEach, vi } from "vitest";

// We will mock webix before importing the skin module
vi.mock("webix", () => {
    const store: Record<string, any> = {};
    const createView = (id: string, children: any[] = []) => {
        const el = document.createElement("div");
        el.classList.add("webix_primary");
        const view: any = {
            config: { id, css: "webix_primary" },
            $view: el,
            define: (key: string, val: any) => { (view.config as any)[key] = val; },
            refresh: vi.fn(),
            resize: vi.fn(),
            getChildViews: () => children,
        };
        store[id] = view;
        return view;
    };
    // Expose a helper to tests to register trees
    (globalThis as any).__createWebixView = createView;
    return {
        default: {},
        $$: (id: string) => store[id],
    };
});

describe("skin manager", () => {
    // reset modules to reload skin.ts with a fresh localStorage state each test
    beforeEach(() => {
        localStorage.clear();
        vi.resetModules();
        // ensure body starts clean
        document.body.className = "";
    });

    it("getSkin defaults to webix_primary and persists via setSkin/toggleSkin", async () => {
        const skin = await import("./skin");
        expect(skin.getSkin()).toBe("webix_primary");

        skin.setSkin("webix_dark");
        expect(skin.getSkin()).toBe("webix_dark");
        expect(localStorage.getItem("app:skin")).toBe("webix_dark");

        const next = skin.toggleSkin();
        expect(next).toBe("webix_primary");
        expect(skin.getSkin()).toBe("webix_primary");
    });

    it("respects persisted skin on module load", async () => {
        localStorage.setItem("app:skin", "webix_dark");
        const skin = await import("./skin");
        expect(skin.getSkin()).toBe("webix_dark");
    });

    it("applySkin updates body and view classes recursively", async () => {
        const skin = await import("./skin");
        // create a tree: root -> child
        const child = (globalThis as any).__createWebixView("child", []);
        const root = (globalThis as any).__createWebixView("root", [child]);

        // initial classes are webix_primary
        expect(root.$view.classList.contains("webix_primary")).toBe(true);
        expect(child.$view.classList.contains("webix_primary")).toBe(true);

        skin.setSkin("webix_dark");
        skin.applySkin(["root"]);

        expect(document.body.classList.contains("webix_dark")).toBe(true);

        // DOM classes updated
        expect(root.$view.classList.contains("webix_dark")).toBe(true);
        expect(child.$view.classList.contains("webix_dark")).toBe(true);

        // config css updated
        expect(root.config.css).toContain("webix_dark");
        expect(child.config.css).toContain("webix_dark");
    });
});
