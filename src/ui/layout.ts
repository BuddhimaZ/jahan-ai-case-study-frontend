import * as webix from "webix";
import globalToolbar from "./components/global_toolbar";
import sidebar, { SIDEBAR_ID } from "./components/sidebar";
import preferencesView, { PREFERENCES_ID } from "./views/preferences";

export default function layout(): webix.ui.layout {

    const menu_data = [
        { id: PREFERENCES_ID, value: "Preferences", icon: "fas fa-cog" },
    ];

    return webix.ui({
        rows: [
            globalToolbar(SIDEBAR_ID),
            {
                view: "layout",
                height: window.innerHeight - 40, // Adjust height to fit below the toolbar, I didn't know how else to do this LOL!
                responsive: true,
                cols: [
                    sidebar(menu_data),
                    {
                        view: "scrollview",
                        padding: 10,
                        responsive: true,
                        scroll: "y", // vertical scrolling
                        body: {
                            cols: [
                                preferencesView()
                            ]
                        }
                    }
                ]
            }
        ]
    });
}