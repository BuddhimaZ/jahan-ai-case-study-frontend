import { http } from "./http";
import type { Account, NotificationSetting, PrivacySetting, ThemeSetting } from "../types";

export function getAccount() {
    return http<Account>(`/me/account/`);
}

export function updateAccount(payload: Partial<Account>) {
    return http<Account>(`/me/account/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function changePassword(current_password: string, new_password: string) {
    return http<void>(`/me/account/change-password/`, {
        method: "POST",
        body: JSON.stringify({ current_password, new_password }),
    });
}

export function getNotifications() {
    return http<NotificationSetting>(`/me/notifications/`);
}

export function updateNotifications(payload: Partial<NotificationSetting>) {
    return http<NotificationSetting>(`/me/notifications/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function getPrivacy() {
    return http<PrivacySetting>(`/me/privacy/`);
}

export function updatePrivacy(payload: Partial<PrivacySetting>) {
    return http<PrivacySetting>(`/me/privacy/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function getTheme() {
    return http<ThemeSetting>(`/me/theme/`);
}

export function updateTheme(payload: Partial<ThemeSetting>) {
    return http<ThemeSetting>(`/me/theme/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}
