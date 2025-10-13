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

import {
    getAccount, updateAccount,
    getNotifications, updateNotifications,
    getPrivacy, updatePrivacy,
    getTheme, updateTheme, changePassword
} from "../../api/me";

import { applyTheme } from "../../theme/applyTheme";

const FREQUENCY: FrequencyEnum[] = ["immediate", "daily", "weekly"];
const LAYOUTS: LayoutEnum[] = ["list", "cards"];
const VISIBILITY: ProfileVisibilityEnum[] = ["public", "private"];

export const PREFERENCES_ID = "preferences";

const ACCOUNT_SETTINGS_FORM_ID = "account_settings";
const NOTIFICATION_SETTINGS_FORM_ID = "notification_settings";
const PRIVACY_SETTINGS_ID = "privacy_settings";
const THEME_SETTINGS_FORM_ID = "theme_settings";
const PASSWORD_CHANGE_FORM_ID = "password_change";


// --- simple frontend validation helpers ---
function isEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isHexColor(value?: string): boolean {
    if (!value) return true; // optional fields are allowed
    return /^#([0-9A-Fa-f]{6})$/.test(value);
}

function inList<T extends string>(value: string, list: ReadonlyArray<T>): boolean {
    return (list as ReadonlyArray<string>).includes(value);
}

// --- progress helpers ---
function ensureProgress(view: webix.ui.baseview): any {
    const v: any = view as any;
    if (!v.showProgress) (webix as any).extend(view, (webix as any).ProgressBar);
    return v;
}


function accountSettings(): webix.ui.accordionitemConfig {
    return {
        header: "Account Settings",
        body: {
            view: "form",
            id: ACCOUNT_SETTINGS_FORM_ID,
            elements: [
                { view: "text", label: "Username", name: "username" },
                { view: "text", label: "Email", name: "email" },
                {
                    cols: [
                        {}, // Without this spacer the whole accordion item shrinks to fit the button, Don't ask me why
                        {
                            view: "button",
                            value: "Save",
                            css: "webix_primary",
                            align: "right",
                            width: 100,
                            click: function (this: any) {
                                const form = this.getFormView ? this.getFormView() : null;
                                if (form) {
                                    const values = form.getValues() as Account;
                                    if (!values.username) {
                                        webix.message({ type: "error", text: "Username is required" });
                                        return;
                                    }
                                    if (!values.email || !isEmail(values.email)) {
                                        webix.message({ type: "error", text: "A valid email is required" });
                                        return;
                                    }
                                    this.disable();
                                    updateAccount(values)
                                        .then(updated => {
                                            form.setValues(updated || values);
                                            webix.message({ type: "success", text: "Account saved" });
                                        })
                                        .catch(() => webix.message({ type: "error", text: "Failed to save account" }))
                                        .finally(() => this.enable());
                                }
                            }
                        }
                    ]
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
            id: PASSWORD_CHANGE_FORM_ID,
            elements: [
                { view: "text", type: "password", label: "Current Password", name: "current_password" },
                { view: "text", type: "password", label: "New Password", name: "new_password" },
                { view: "text", type: "password", label: "Confirm New Password", name: "confirm_new_password" },
                {
                    cols: [
                        {},
                        {
                            view: "button",
                            value: "Change Password",
                            css: "webix_primary",
                            align: "right",
                            width: 100,
                            click: function (this: any) {
                                const form = this.getFormView ? this.getFormView() : null;
                                if (form) {
                                    const values = form.getValues();
                                    if (values.new_password !== values.confirm_new_password) {
                                        webix.message({ type: "error", text: "New passwords do not match" });
                                        return;
                                    }
                                    if (!values.current_password || !values.new_password) {
                                        webix.message({ type: "error", text: "Please fill all password fields" });
                                        return;
                                    }
                                    if ((values.new_password as string).length < 8) {
                                        webix.message({ type: "error", text: "New password must be at least 8 characters" });
                                        return;
                                    }
                                    this.disable();
                                    changePassword(values.current_password, values.new_password)
                                        .then(() => {
                                            webix.message({ type: "success", text: "Password changed" });
                                            form.clear();
                                        })
                                        .catch(() => webix.message({ type: "error", text: "Failed to change password" }))
                                        .finally(() => this.enable());
                                }
                            }
                        }
                    ]
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
            id: NOTIFICATION_SETTINGS_FORM_ID,
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
                    cols: [
                        {},
                        {
                            view: "button",
                            value: "Save",
                            css: "webix_primary",
                            align: "right",
                            width: 100,
                            click: function (this: any) {
                                const form = this.getFormView ? this.getFormView() : null;
                                if (form) {
                                    const values = form.getValues() as NotificationSetting;
                                    if (values.frequency && !inList(values.frequency, FREQUENCY)) {
                                        webix.message({ type: "error", text: "Invalid frequency" });
                                        return;
                                    }
                                    this.disable();
                                    updateNotifications(values)
                                        .then(updated => {
                                            form.setValues(updated || values);
                                            webix.message({ type: "success", text: "Notifications saved" });
                                        })
                                        .catch(() => webix.message({ type: "error", text: "Failed to save notifications" }))
                                        .finally(() => this.enable());
                                }
                            }
                        }
                    ]
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
            id: PRIVACY_SETTINGS_ID,
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
                    cols: [
                        {},
                        {
                            view: "button",
                            value: "Save",
                            css: "webix_primary",
                            align: "right",
                            width: 100,
                            click: function (this: any) {
                                const form = this.getFormView ? this.getFormView() : null;
                                if (form) {
                                    const values = form.getValues() as PrivacySetting;
                                    if (values.profile_visibility && !inList(values.profile_visibility, VISIBILITY)) {
                                        webix.message({ type: "error", text: "Invalid profile visibility" });
                                        return;
                                    }
                                    this.disable();
                                    updatePrivacy(values)
                                        .then(updated => {
                                            form.setValues(updated || values);
                                            webix.message({ type: "success", text: "Privacy saved" });
                                        })
                                        .catch(() => webix.message({ type: "error", text: "Failed to save privacy" }))
                                        .finally(() => this.enable());
                                }
                            }
                        }
                    ]
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
            id: THEME_SETTINGS_FORM_ID,
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
                    cols: [
                        {},
                        {
                            view: "button",
                            value: "Save",
                            css: "webix_primary",
                            align: "right",
                            width: 100,
                            click: function (this: any) {
                                const form = this.getFormView ? this.getFormView() : null;
                                if (form) {
                                    const values = form.getValues() as ThemeSetting;
                                    const colorFields = [
                                        values.primary_color,
                                        values.secondary_color,
                                        values.background_primary_color,
                                        values.background_secondary_color,
                                        values.font_primary_color,
                                        values.font_secondary_color
                                    ];
                                    if (!colorFields.every(isHexColor)) {
                                        webix.message({ type: "error", text: "Colors must be in #RRGGBB format" });
                                        return;
                                    }
                                    if (values.layout && !inList(values.layout, LAYOUTS)) {
                                        webix.message({ type: "error", text: "Invalid layout" });
                                        return;
                                    }
                                    this.disable();
                                    updateTheme(values)
                                        .then(updated => {
                                            form.setValues(updated || values);
                                            webix.message({ type: "success", text: "Theme saved" });
                                        })
                                        .catch(() => webix.message({ type: "error", text: "Failed to save theme" }))
                                        .finally(() => this.enable());
                                }
                            }
                        }
                    ]
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

export async function loadPreferences(view: webix.ui.baseview) {

    const v = ensureProgress(view)
    v.showProgress({ type: "icon" });
    try {
        const [acc, notif, priv, theme] = await Promise.all([
            getAccount(), getNotifications(), getPrivacy(), getTheme()
        ]);
        (webix.$$(ACCOUNT_SETTINGS_FORM_ID) as webix.ui.form).setValues(acc);
        (webix.$$(NOTIFICATION_SETTINGS_FORM_ID) as webix.ui.form).setValues(notif);
        (webix.$$(PRIVACY_SETTINGS_ID) as webix.ui.form).setValues(priv);
        (webix.$$(THEME_SETTINGS_FORM_ID) as webix.ui.form).setValues(theme);
        applyTheme(theme);
    } catch (e: any) {
        console.error("Failed to load preferences:", e);
    } finally {
        v.hideProgress();
    }

}