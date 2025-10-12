export type LayoutEnum = "list" | "cards";
export type ProfileVisibilityEnum = "public" | "private";
export type FrequencyEnum = "immediate" | "daily" | "weekly";

export interface Account {
    username: string;
    email: string;
}

export interface NotificationSetting {
    user: number;
    email_notifications?: boolean;
    push_notifications?: boolean;
    frequency?: FrequencyEnum;
}

export interface PrivacySetting {
    user: number;
    profile_visibility?: ProfileVisibilityEnum;
    data_sharing?: boolean;
}

export interface ThemeSetting {
    user: number;
    primary_color?: string; // #RRGGBB
    secondary_color?: string;
    font_primary_color?: string;
    font_secondary_color?: string;
    font_family?: string;
    layout?: LayoutEnum;
}

export interface TokenPair {
    access: string;
    refresh: string;
}

export interface TokenRefresh {
    access: string;
}
