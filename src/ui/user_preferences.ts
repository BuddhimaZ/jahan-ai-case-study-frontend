import * as webix from "webix";
import {
    getAccount, updateAccount,
    getNotifications, updateNotifications,
    getPrivacy, updatePrivacy,
    getTheme, updateTheme, changePassword
} from "../api/me";
import type { FrequencyEnum, LayoutEnum, ProfileVisibilityEnum, ThemeSetting } from "../types";
import { applyTheme } from "../theme/applyTheme";


export function userPreferencesView(): webix.ui.layout {
    return webix.ui({
    });
}