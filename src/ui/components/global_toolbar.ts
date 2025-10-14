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
                view: "icon",
                width: 40,
                css: "toolbar-icon",
                icon: (getSkin() === "webix_dark" ? "fas fa-sun" : "fas fa-moon"),
                tooltip: (getSkin() === "webix_dark" ? "Switch to light" : "Switch to dark"),
                click: function (this: any) {
                    const next = toggleSkin();
                    const rootId = this.getTopParentView()?.config.id as string | undefined;
                    applySkin([rootId, sidebar_id]);
                    // update icon
                    if (this.define && this.refresh) {
                        this.define("icon", next === "webix_dark" ? "fas fa-sun" : "fas fa-moon");
                        this.define("tooltip", next === "webix_dark" ? "Switch to light" : "Switch to dark");
                        this.refresh();
                    }
                }
            },
            { view: "icon", icon: "fas fa-door-open", css: "toolbar-icon", width: 40, click: () => webix.callEvent("app:logout", []) }
        ]
    };
}
