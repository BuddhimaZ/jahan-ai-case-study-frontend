import * as webix from "webix";
import { login } from "../api/http";

export const LOGIN_ROOT_ID = "login_root_layout";

export function loginView(onSuccess: () => void): webix.ui.layout {
    const formId = "login_form";
    const messageId = "login_message";
    const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c] as string));
    const view = webix.ui({
        id: LOGIN_ROOT_ID,
        rows: [
            {},
            {
                cols: [
                    {},
                    {
                        maxWidth: 520,
                        minWidth: 300,
                        width: 480,
                        rows: [
                            { template: "Sign in", type: "header" },
                            {
                                view: "form",
                                id: formId,
                                borderless: true,
                                elementsConfig: { labelWidth: 120 },
                                elements: [
                                    { view: "text", name: "username", label: "Username", required: true, invalidMessage: "Required" },
                                    { view: "text", type: "password", name: "password", label: "Password", required: true, invalidMessage: "Required" },
                                    { id: messageId, view: "template", label: "Error", template: "", hidden: true, css: "webix_warning" },
                                    {
                                        cols: [
                                            {
                                                view: "button", value: "Login", css: "webix_primary", hotkey: "enter", click: async () => {
                                                    const form = webix.$$(formId) as webix.ui.form;
                                                    if (!form.validate()) return;
                                                    const { username, password } = form.getValues();
                                                    try {
                                                        (webix.$$(messageId) as any).hide();
                                                        webix.extend(form, webix.ProgressBar);
                                                        (form as any).showProgress({ type: "icon" });
                                                        await login(username, password);
                                                        onSuccess();
                                                    } catch (e: any) {
                                                        const detail = e?.detail;
                                                        const msg = detail?.detail || "Invalid credentials";
                                                        (webix.$$(messageId) as any).show();
                                                        (webix.$$(messageId) as any).setHTML("<div style='padding:8px;color:#b00020'>" + escapeHtml(String(msg)) + "</div>");
                                                    } finally {
                                                        (form as any).hideProgress();
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ],
                                rules: {
                                    username: (v: string) => !!v,
                                    password: (v: string) => !!v,
                                }
                            }
                        ]
                    },
                    {}
                ]
            },
            {}
        ]
    }) as webix.ui.layout;
    return view;
}
