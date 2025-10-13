import * as webix from "webix";
import globalToolbar from "./components/global_toolbar";
import sidebar, { SIDEBAR_ID } from "./components/sidebar";
import preferencesView, { PREFERENCES_ID, loadPreferences } from "./views/preferences";

export const APP_ROOT_ID = "app_root_layout";

export default function layout(): webix.ui.layout {

    const menu_data = [
        { id: PREFERENCES_ID, value: "Preferences", icon: "fas fa-cog" },
    ];

    const layout = webix.ui<webix.ui.layout>({
        id: APP_ROOT_ID,
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
                        responsive: true,
                        scroll: "y", // vertical scrolling
                        body: {
                            padding: 20,
                            cols: [
                                preferencesView()
                            ]
                        }
                    }
                ]
            }
        ]
    });

    // This is a slightly hacky way to apply the theme on initial load
    // But currently since we only have one layout, it's fine
    // and it works soo... -\_-(ツ)_/-
    loadPreferences(layout);

    return layout;
}