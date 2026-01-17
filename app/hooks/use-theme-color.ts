import { useTheme } from "next-themes";
import { useEffect } from "react";

const THEME_COLORS = {
    light: "#f2f1f7",
    dark: "#0a0712",
} as const;

export function useThemeColor() {
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const isDark = resolvedTheme === "dark";
        const color = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

        // Update theme-color meta tag
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute("content", color);
        }

        // Set color-scheme on HTML element (required for Safari toolbar color)
        document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    }, [resolvedTheme]);
}
