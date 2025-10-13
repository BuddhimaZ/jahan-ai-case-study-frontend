import * as webix from "webix";

// Return a config object (not an instantiated view). The root webix.ui() call lives in layout.ts
export default function globalToolbar(sidebar_id: string | null | undefined): webix.ui.toolbarConfig {
    return {
        height: 40,
        view: "toolbar",
        css: "webix_dark",
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
            { view: "icon", icon: "fas fa-door-open", css: "toolbar-icon", width: 40, click: () => webix.callEvent("app:logout", []) }
        ]
    };
}
