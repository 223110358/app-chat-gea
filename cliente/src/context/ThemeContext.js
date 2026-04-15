import { createContext, useCallback, useMemo, useState } from "react";

const lightColors = {
    mode: "light",
    background: "#f6f7f5",
    surface: "#ffffff",
    surfaceAlt: "#edf2ed",
    border: "#d8ded8",
    text: "#111411",
    muted: "#606a60",
    primary: "#2d7d32",
    primaryStrong: "#1f6b2a",
    primaryText: "#ffffff",
    danger: "#b42318",
    dangerSoft: "#fee4e2",
    input: "#ffffff",
    bubbleMine: "#2d7d32",
    bubbleOther: "#ffffff",
};

const darkColors = {
    mode: "dark",
    background: "#050505",
    surface: "#111111",
    surfaceAlt: "#181818",
    border: "#242424",
    text: "#ffffff",
    muted: "#a3a3a3",
    primary: "#2d7d32",
    primaryStrong: "#1f6b2a",
    primaryText: "#ffffff",
    danger: "#f97066",
    dangerSoft: "#2a1212",
    input: "#151515",
    bubbleMine: "#2d7d32",
    bubbleOther: "#1b1b1b",
};

export const ThemeContext = createContext({
    themeMode: "dark",
    colors: darkColors,
    toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
    const [themeMode, setThemeMode] = useState("dark");

    const toggleTheme = useCallback(() => {
        setThemeMode((current) => current === "dark" ? "light" : "dark");
    }, []);

    const colors = themeMode === "dark" ? darkColors : lightColors;

    const value = useMemo(() => ({
        themeMode,
        colors,
        toggleTheme,
    }), [colors, themeMode, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
