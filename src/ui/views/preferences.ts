import * as webix from "webix";
import type {
    Account,
    NotificationSetting,
    PrivacySetting,
    ThemeSetting,
    FrequencyEnum,
    LayoutEnum,
    ProfileVisibilityEnum
} from "../../types";

const FREQUENCY: FrequencyEnum[] = ["immediate", "daily", "weekly"];
const LAYOUTS: LayoutEnum[] = ["list", "cards"];
const VISIBILITY: ProfileVisibilityEnum[] = ["public", "private"];

export const PREFERENCES_ID = "preferences";


function accountSettings(): webix.ui.accordionitemConfig {
    return {
        header: "Account Settings",
        body: {
            view: "form",
            elements: [
                { view: "text", label: "Username", name: "username" },
                { view: "text", label: "Email", name: "email" },
                {
                    view: "button",
                    value: "Save",
                    css: "webix_primary",
                    align: "right",
                    click: function (this: any) {
                        const form = this.getFormView ? this.getFormView() : null;
                        if (form) {
                            const values = form.getValues() as Account;
                            // TODO: submit values
                            void values;
                        }
                    }
                }
            ]
        }
    };
}

function notificationSettings(): webix.ui.accordionitemConfig {
    return {
        header: "Notification Settings",
        body: {
            view: "form",
            elements: [
                // Hidden field to hold the numeric user id
                { view: "text", name: "user", hidden: true, type: "number" },
                // Booleans per NotificationSetting
                { view: "checkbox", label: "Email Notifications", name: "email_notifications", checkValue: true, uncheckValue: false, value: true },
                { view: "checkbox", label: "Push Notifications", name: "push_notifications", checkValue: true, uncheckValue: false, value: false },
                // Frequency selector matching FrequencyEnum: "immediate" | "daily" | "weekly"
                {
                    view: "select",
                    label: "Frequency",
                    name: "frequency",
                    options: FREQUENCY.map(freq => ({ id: freq, value: freq })),
                    value: "immediate"
                },
                {
                    view: "button",
                    value: "Save",
                    css: "webix_primary",
                    align: "right",
                    click: function (this: any) {
                        const form = this.getFormView ? this.getFormView() : null;
                        if (form) {
                            const values = form.getValues() as NotificationSetting;
                            // TODO: submit values
                            void values;
                        }
                    }
                }
            ]
        }
    };
}

function privacySettings(): webix.ui.accordionitemConfig {
    return {
        header: "Privacy Settings",
        body: {
            view: "form",
            elements: [
                // Hidden field to hold the numeric user id
                { view: "text", name: "user", hidden: true, type: "number" },
                {
                    view: "select",
                    label: "Profile Visibility",
                    name: "profile_visibility",
                    options: VISIBILITY.map(vis => ({ id: vis, value: vis })),
                    value: "public"
                },
                { view: "checkbox", label: "Data Sharing", name: "data_sharing", checkValue: true, uncheckValue: false, value: false },
                {
                    view: "button",
                    value: "Save",
                    css: "webix_primary",
                    align: "right",
                    click: function (this: any) {
                        const form = this.getFormView ? this.getFormView() : null;
                        if (form) {
                            const values = form.getValues() as PrivacySetting;
                            // TODO: submit values
                            void values;
                        }
                    }
                }
            ]
        }
    };
}

function themeSettings(): webix.ui.accordionitemConfig {
    return {
        header: "Theme Settings",
        body: {
            view: "form",
            elements: [
                // Hidden field to hold the numeric user id
                { view: "text", name: "user", hidden: true, type: "number" },
                // Color pickers for theme colors
                { view: "colorpicker", label: "Primary Color", name: "primary_color", value: "#2F80ED" },
                { view: "colorpicker", label: "Secondary Color", name: "secondary_color", value: "#56CCF2" },
                { view: "colorpicker", label: "Background Primary", name: "background_primary_color", value: "#FFFFFF" },
                { view: "colorpicker", label: "Background Secondary", name: "background_secondary_color", value: "#F4F6F8" },
                { view: "colorpicker", label: "Font Primary", name: "font_primary_color", value: "#1F2937" },
                { view: "colorpicker", label: "Font Secondary", name: "font_secondary_color", value: "#4B5563" },
                // Font family select and layout select
                {
                    view: "select",
                    label: "Font Family",
                    name: "font_family",
                    options: [
                        { id: "Inter, sans-serif", value: "Inter" },
                        { id: "Roboto, sans-serif", value: "Roboto" },
                        { id: "Arial, Helvetica, sans-serif", value: "Arial" },
                        { id: "Georgia, serif", value: "Georgia" },
                        { id: "'Times New Roman', Times, serif", value: "Times New Roman" },
                        { id: "'Courier New', Courier, monospace", value: "Courier New" },
                        { id: "Monaco, Menlo, Consolas, 'Courier New', monospace", value: "Monospace" }
                    ],
                    value: "Inter, sans-serif"
                },
                {
                    view: "select",
                    label: "Layout",
                    name: "layout",
                    options: LAYOUTS.map(layout => ({ id: layout, value: layout })),
                    value: "list"
                },
                {
                    view: "button",
                    value: "Save",
                    css: "webix_primary",
                    align: "right",
                    click: function (this: any) {
                        const form = this.getFormView ? this.getFormView() : null;
                        if (form) {
                            const values = form.getValues() as ThemeSetting;
                            // TODO: submit values
                            void values;
                        }
                    }
                }
            ]
        }
    };
}

function passwordChangeSection(): webix.ui.accordionitemConfig {
    return {
        header: "Change Password",
        collapsed: true,
        body: {
            view: "form",
            elements: [
                { view: "text", type: "password", label: "Current Password", name: "current_password" },
                { view: "text", type: "password", label: "New Password", name: "new_password" },
                { view: "text", type: "password", label: "Confirm New Password", name: "confirm_new_password" },
                {
                    view: "button",
                    value: "Change Password",
                    css: "webix_primary",
                    align: "right",
                    click: function (this: any) {
                        const form = this.getFormView ? this.getFormView() : null;
                        if (form) {
                            const values = form.getValues();
                            if (values.new_password !== values.confirm_new_password) {
                                webix.message({ type: "error", text: "New passwords do not match" });
                                return;
                            }
                            // TODO: Implement API call for changing password with values.current_password and values.new_password
                            void values;
                        }
                    }
                }
            ]
        }
    };
}



// Return a config object; the parent layout will instantiate it
export default function preferencesView(): webix.ui.layoutConfig {
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
                    passwordChangeSection(),
                    notificationSettings(),
                    privacySettings(),
                    themeSettings(),
                    // Add more accordion items for different preference sections
                ]
            }
        ]
    };
}