import * as webix from "webix";
import '@fortawesome/fontawesome-free/css/all.min.css';
import globalToolbar from "./components/global_toolbar";
import sidebar, { SIDEBAR_ID } from "./components/sidebar";

export default function layout(): webix.ui.layout {
    return webix.ui({
        rows: [
            globalToolbar(SIDEBAR_ID),
            {},
            {
                view: "layout",
                cols: [
                    sidebar(),
                    { view: "resizer" },
                ]
            }
        ]
    });
}