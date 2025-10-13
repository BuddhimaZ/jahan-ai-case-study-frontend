import * as webix from "webix";
import { getSkin, toggleSkin, applySkin, } from "../../theme/skin";

// Return a config object (not an instantiated view). The root webix.ui() call lives in layout.ts
export default function globalToolbar(sidebar_id: string | null | undefined): webix.ui.toolbarConfig {
    return {
        height: 40,
        view: "toolbar",
        css: getSkin(),
        padding: 3,
        elements: [
            {
                view: "icon", icon: "fas fa-bars", css: "toolbar-icon", width: 40, click: () => {
                    if (sidebar_id) { (webix.$$(sidebar_id) as webix.ui.sidebar)?.toggle(); }
                    else { (webix.$$("$sidebar1") as webix.ui.sidebar)?.toggle(); }
                }
            },
            { view: "label", label: "JahanAI", align: "left" },
            {},
            {
                view: "button",
                css: "webix_transparent",
                width: 140,
                value: (getSkin() === "webix_dark" ? "Light theme" : "Dark theme"),
                click: function (this: any) {
                    const next = toggleSkin();
                    // Re-apply CSS class recursively from the top parent (app root) and sidebar
                    const rootId = this.getTopParentView()?.config.id as string | undefined;
                    applySkin([rootId, sidebar_id]);
                    // Update own label
                    if (this.setValue) this.setValue(next === "webix_dark" ? "Light theme" : "Dark theme");
                }
            },
            { view: "icon", icon: "fas fa-door-open", css: "toolbar-icon", width: 40, click: () => webix.callEvent("app:logout", []) }
        ]
    };
}
