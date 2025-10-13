import type { ThemeSetting } from "../types";

export function applyTheme(theme: Partial<ThemeSetting> | undefined) {
    const root = document.documentElement;
    const setVar = (name: string, value: string | undefined) => {
        if (!value) return;
        root.style.setProperty(name, value);
    };
    setVar("--color-primary", theme?.primary_color);
    setVar("--color-secondary", theme?.secondary_color);
    setVar("--background-primary-color", theme?.background_primary_color);
    setVar("--background-secondary-color", theme?.background_secondary_color);
    setVar("--font-primary-color", theme?.font_primary_color);
    setVar("--font-secondary-color", theme?.font_secondary_color);
    if (theme?.font_family) {
        root.style.setProperty("--font-family", theme.font_family);
    }
}
