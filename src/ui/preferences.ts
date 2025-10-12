import * as webix from "webix";
import {
    getAccount, updateAccount,
    getNotifications, updateNotifications,
    getPrivacy, updatePrivacy,
    getTheme, updateTheme, changePassword
} from "../api/me";
import type { FrequencyEnum, LayoutEnum, ProfileVisibilityEnum, ThemeSetting } from "../types";
import { applyTheme } from "../theme/applyTheme";

const FREQUENCY: FrequencyEnum[] = ["immediate", "daily", "weekly"];
const LAYOUTS: LayoutEnum[] = ["list", "cards"];
const VISIBILITY: ProfileVisibilityEnum[] = ["public", "private"];

function sectionHeader(title: string) {
    return { template: title, type: "section" } as webix.ui.templateConfig;
}

function successToast(text: string) { webix.message({ type: "success", text }); }
function errorToast(text: string) { webix.message({ type: "error", text }); }

export function preferencesView(): webix.ui.layout {
    const accountFormId = "account_form";
    const notifFormId = "notif_form";
    const themeFormId = "theme_form";
    const privacyFormId = "privacy_form";
    const pwdFormId = "pwd_form";

    const accountForm: webix.ui.formConfig = {
        view: "form",
        id: accountFormId,
        minWidth: 300,
        elementsConfig: { labelWidth: 160 },
        elements: [
            sectionHeader("Account Settings"),
            { view: "text", name: "username", label: "Username", required: true, invalidMessage: "Required" },
            { view: "text", name: "email", label: "Email", required: true, invalidMessage: "Email required" },
            {
                cols: [
                    {
                        view: "button", value: "Save", css: "webix_primary", click: async () => {
                            const form = webix.$$(accountFormId) as webix.ui.form;
                            if (!form.validate()) return;
                            try {
                                webix.extend(form, webix.ProgressBar); (form as any).showProgress();
                                const values = form.getValues();
                                await updateAccount({ username: values.username, email: values.email });
                                successToast("Account saved");
                            } catch (e: any) {
                                const msg = e?.detail ? JSON.stringify(e.detail) : "Failed to save";
                                errorToast(msg);
                            } finally { (form as any).hideProgress(); }
                        }
                    },
                    {},
                    { view: "button", value: "Change Password", click: () => (webix.$$(pwdFormId) as any).show() }
                ]
            }
        ],
        rules: {
            username: (v: string) => !!v,
            email: (v: string) => /.+@.+\..+/.test(String(v)),
        }
    };

    const pwdForm: any = {
        view: "window", id: pwdFormId, position: "center", modal: true, head: "Change Password",
        body: {
            view: "form", id: pwdFormId + "_form", padding: 20, elementsConfig: { labelWidth: 180 }, elements: [
                { view: "text", type: "password", name: "current_password", label: "Current Password", required: true },
                { view: "text", type: "password", name: "new_password", label: "New Password", required: true },
                {
                    margin: 8, cols: [
                        {
                            view: "button", value: "Update", css: "webix_primary", click: async () => {
                                const form = webix.$$(pwdFormId + "_form") as webix.ui.form;
                                if (!form.validate()) return;
                                const { current_password, new_password } = form.getValues();
                                try {
                                    webix.extend(form, webix.ProgressBar); (form as any).showProgress();
                                    await changePassword(current_password, new_password);
                                    successToast("Password updated");
                                    (webix.$$(pwdFormId) as webix.ui.window).hide();
                                } catch (e: any) { errorToast(e?.detail ? JSON.stringify(e.detail) : "Failed to update"); }
                                finally { (form as any).hideProgress(); }
                            }
                        },
                        { view: "button", value: "Cancel", click: () => (webix.$$(pwdFormId) as webix.ui.window).hide() }
                    ]
                }
            ], rules: {
                current_password: (v: string) => !!v,
                new_password: (v: string) => !!v,
            }
        }
    };

    const notifForm: webix.ui.formConfig = {
        view: "form", id: notifFormId, minWidth: 300, elementsConfig: { labelWidth: 220 },
        elements: [
            sectionHeader("Notification Settings"),
            { view: "switch", name: "email_notifications", label: "Email Notifications" },
            { view: "switch", name: "push_notifications", label: "Push Notifications" },
            { view: "richselect", name: "frequency", label: "Frequency", options: FREQUENCY.map(v => ({ id: v, value: v })) },
            {
                view: "button", value: "Save", css: "webix_primary", click: async () => {
                    const form = webix.$$(notifFormId) as webix.ui.form;
                    try {
                        webix.extend(form, webix.ProgressBar); (form as any).showProgress();
                        const v = form.getValues();
                        await updateNotifications({
                            email_notifications: !!v.email_notifications,
                            push_notifications: !!v.push_notifications,
                            frequency: v.frequency,
                        });
                        successToast("Notifications saved");
                    } catch (e: any) { errorToast(e?.detail ? JSON.stringify(e.detail) : "Failed to save"); }
                    finally { (form as any).hideProgress(); }
                }
            }
        ]
    };

    const themeForm: webix.ui.formConfig = {
        view: "form", id: themeFormId, minWidth: 300, elementsConfig: { labelWidth: 220 },
        elements: [
            sectionHeader("Theme Settings"),
            { view: "text", name: "primary_color", label: "Primary Color (#hex)" },
            { view: "text", name: "secondary_color", label: "Secondary Color (#hex)" },
            { view: "text", name: "font_primary_color", label: "Font Primary Color (#hex)" },
            { view: "text", name: "font_secondary_color", label: "Font Secondary Color (#hex)" },
            { view: "text", name: "font_family", label: "Font Family" },
            { view: "segmented", name: "layout", label: "Layout", options: LAYOUTS.map(x => ({ id: x, value: x })) },
            {
                view: "button", value: "Save", css: "webix_primary", click: async () => {
                    const form = webix.$$(themeFormId) as webix.ui.form;
                    const v = form.getValues();
                    // basic hex validation
                    const hex = /^#[0-9a-fA-F]{3,6}$/;
                    const bad = ["primary_color", "secondary_color", "font_primary_color", "font_secondary_color"].filter(k => v[k] && !hex.test(v[k]));
                    if (bad.length) { errorToast("Invalid color: " + bad.join(", ")); return; }
                    try {
                        webix.extend(form, webix.ProgressBar); (form as any).showProgress();
                        const updated = await updateTheme(v as Partial<ThemeSetting>);
                        applyTheme(updated);
                        successToast("Theme saved");
                    } catch (e: any) { errorToast(e?.detail ? JSON.stringify(e.detail) : "Failed to save"); }
                    finally { (form as any).hideProgress(); }
                }
            }
        ]
    };

    const privacyForm: webix.ui.formConfig = {
        view: "form", id: privacyFormId, minWidth: 300, elementsConfig: { labelWidth: 220 },
        elements: [
            sectionHeader("Privacy Settings"),
            { view: "richselect", name: "profile_visibility", label: "Profile Visibility", options: VISIBILITY.map(v => ({ id: v, value: v })) },
            { view: "switch", name: "data_sharing", label: "Data Sharing" },
            {
                view: "button", value: "Save", css: "webix_primary", click: async () => {
                    const form = webix.$$(privacyFormId) as webix.ui.form;
                    try {
                        webix.extend(form, webix.ProgressBar); (form as any).showProgress();
                        const v = form.getValues();
                        await updatePrivacy({ profile_visibility: v.profile_visibility, data_sharing: !!v.data_sharing });
                        successToast("Privacy saved");
                    } catch (e: any) { errorToast(e?.detail ? JSON.stringify(e.detail) : "Failed to save"); }
                    finally { (form as any).hideProgress(); }
                }
            }
        ]
    };

    const layout: webix.ui.layout = webix.ui({
        rows: [
            {
                view: "toolbar", elements: [
                    { view: "label", label: "User Preferences" },
                    {},
                    { view: "button", value: "Logout", width: 100, click: () => webix.callEvent("app:logout", []) }
                ]
            },
            {
                cols: [
                    { rows: [accountForm, pwdForm] },
                    { view: "resizer" },
                    { rows: [notifForm, privacyForm, themeForm] }
                ]
            }
        ]
    }) as webix.ui.layout;

    // Load initial data
    (async () => {
        try {
            const [acc, notif, priv, theme] = await Promise.all([
                getAccount(), getNotifications(), getPrivacy(), getTheme()
            ]);
            (webix.$$(accountFormId) as webix.ui.form).setValues(acc);
            (webix.$$(notifFormId) as webix.ui.form).setValues(notif);
            (webix.$$(privacyFormId) as webix.ui.form).setValues(priv);
            (webix.$$(themeFormId) as webix.ui.form).setValues(theme);
            applyTheme(theme);
        } catch (e: any) {
            errorToast("Failed to load preferences");
        }
    })();

    return layout;
}
