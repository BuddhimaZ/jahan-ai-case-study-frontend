import '@fortawesome/fontawesome-free/css/all.min.css';

export const PREFERENCES_ID = "preferences";


function accountSettings(): any {
    return {
        header: "Account Settings",
        body: {
            view: "form",
            elements: [
                { view: "text", label: "Username", name: "username" },
                { view: "text", label: "Email", name: "email" },
                { view: "button", value: "Save", css: "webix_primary" }
            ]
        }
    };
}

// Return a config object; the parent layout will instantiate it
export default function preferencesView(): any {
    return {
        id: PREFERENCES_ID,
        view: "layout",
        hidden: false,
        rows: [
            {
                view: "toolbar",
                css: "webix_primary",
                padding: 3,
                elements: [
                    { view: "label", label: "Preferences", align: "left" }
                ]
            },
            {
                view: "accordion",
                multi: true,
                animate: true,
                rows: [
                    accountSettings(),
                    // Add more accordion items for different preference sections
                ]
            }
        ]
    };
}