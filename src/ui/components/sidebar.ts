import * as webix from "webix";
import '@fortawesome/fontawesome-free/css/all.min.css';

export const SIDEBAR_ID = "sidebar1";

export default function sidebar(): webix.ui.sidebar {
    return webix.ui({
        view: "sidebar",
        id: SIDEBAR_ID,
        css: "webix_dark",
        width: 200,
        toggled: true,
        data: [
            { id: "preferences", value: "Preferences", icon: "fas fa-cog" },
            { id: "about", value: "About", icon: "fas fa-info-circle" }
        ],
        on: {
            onAfterSelect: function (id: string) {
                webix.message("Selected: " + id);
            }
        }
    });
}
