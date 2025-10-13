import * as webix from "webix";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { getSkin } from "../../theme/skin";

export const SIDEBAR_ID = "sidebar1";

let selected_id: string | null = null;

// Return a config object instead of instantiating the sidebar immediately
export default function sidebar(menu_data: any[]): any {
    return {
        view: "sidebar",
        id: SIDEBAR_ID,
        css: getSkin(),
        width: 200,
        toggled: true,
        select: true,
        data: menu_data,
        ready: function (this: webix.ui.sidebar) {
            // Select the first item by default to ensure corresponding view is visible
            const first = (this as any).getFirstId();
            if (first) this.select(first);
        },
        on: {
            onAfterSelect: function (id: string) {
                if (selected_id === id) return;

                if (selected_id !== null) {
                    (webix.$$(selected_id) as webix.ui.view)?.hide();
                }

                (webix.$$(id) as webix.ui.view)?.show();
                selected_id = id;
            }
        }
    };
}
