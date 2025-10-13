import * as webix from "webix";
import '@fortawesome/fontawesome-free/css/all.min.css';
import globalToolbar from "./components/global_toolbar";
import sidebar, { SIDEBAR_ID } from "./components/sidebar";
import preferencesView, { PREFERENCES_ID } from "./views/preferences";

export default function layout(): webix.ui.layout {

    const menu_data = [
        { id: PREFERENCES_ID, value: "Preferences", icon: "fas fa-cog" },
        { id: "help", value: "Help", icon: "fas fa-question-circle" }
    ];

    return webix.ui({
        rows: [
            globalToolbar(SIDEBAR_ID),
            {
                view: "layout",
                responsive: true,
                cols: [
                    sidebar(menu_data),
                    {
                        view: "layout",
                        cols: [
                            preferencesView(),
                            { id: "help", hidden: true, template: "<div style='padding:20px;'><h2>Help</h2><p>This is the help section. Here you can find FAQs and contact support.</p></div>" }
                        ]
                    }
                ]
            }
        ]
    });
}