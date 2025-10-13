import * as webix from "webix";

export type SkinClass = "webix_primary" | "webix_dark";

const STORAGE_KEY = "app:skin";

let currentSkin: SkinClass = (localStorage.getItem(STORAGE_KEY) as SkinClass) || "webix_primary";

export function getSkin(): SkinClass {
    return currentSkin;
}

export function setSkin(skin: SkinClass): SkinClass {
    currentSkin = skin;
    try { localStorage.setItem(STORAGE_KEY, skin); } catch { /* ignore */ }
    return currentSkin;
}

export function toggleSkin(): SkinClass {
    const next: SkinClass = currentSkin === "webix_dark" ? "webix_primary" : "webix_dark";
    return setSkin(next);
}

// Apply skin CSS class to a set of Webix view ids
export function applySkin(ids: Array<string | undefined | null>): void {
    // Also update document body class so descendant selectors (e.g., .webix_dark .webix_view) apply globally
    try {
        document.body.classList.remove("webix_dark", "webix_primary");
        document.body.classList.add(getSkin());
    } catch { /* ignore */ }

    const targetSkin = getSkin();
    const replaceCss = (css: any): any => {
        if (typeof css === "string") {
            return css
                .replace(/\bwebix_dark\b/g, targetSkin)
                .replace(/\bwebix_primary\b/g, targetSkin);
        }
        if (Array.isArray(css)) {
            return css.map(x => replaceCss(x));
        }
        return css || targetSkin; // if null/undefined, apply skin
    };

    const visit = (view: any) => {
        if (!view || !view.define) return;
        const current = view.config?.css;
        const nextCss = replaceCss(current);
        view.define("css", nextCss);
        // Update DOM class directly to ensure immediate effect
        try {
            if (view.$view && view.$view.classList) {
                view.$view.classList.remove("webix_dark", "webix_primary");
                view.$view.classList.add(targetSkin);
            }
        } catch { /* ignore */ }
        if (view.refresh) { try { view.refresh(); } catch { /* ignore */ } }
        if (view.resize) { try { view.resize(); } catch { /* ignore */ } }
        const children = view.getChildViews ? view.getChildViews() : [];
        if (children && children.length) children.forEach(visit);
    };

    ids.forEach(id => {
        if (!id) return;
        const v = webix.$$(id) as any;
        visit(v);
    });
}
