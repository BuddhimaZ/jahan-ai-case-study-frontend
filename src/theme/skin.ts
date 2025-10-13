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
    ids.forEach(id => {
        if (!id) return;
        const v = (window as any).webix?.$$(id);
        if (v && v.define) {
            v.define("css", getSkin());
            if (v.refresh) v.refresh();
        }
    });
}
