import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolved: "light" | "dark";
};

function getInitialState(storageKey: string, defaultTheme: Theme): ThemeProviderState {
  const stored = getStoredTheme(storageKey);
  const theme = stored ?? defaultTheme;
  const resolved = resolveTheme(theme);
  return { theme, resolved };
}

function getStoredTheme(storageKey: string): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return null;
}

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

const THEME_COLORS: Record<"light" | "dark", string> = {
  light: "#ffffff",
  dark: "#181b23",
};

function syncThemeColorMeta(resolved: "light" | "dark") {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = THEME_COLORS[resolved];
}

function applyTheme(resolved: "light" | "dark", suppressTransitions = false) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (suppressTransitions) {
    root.classList.add("theme-switching");
  }
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  syncThemeColorMeta(resolved);
  if (suppressTransitions) {
    void window.getComputedStyle(root).color;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("theme-switching");
      });
    });
  }
}

const ThemeProviderContext = React.createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolved: "light" | "dark";
} | null>(null);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "magyar-theme",
}: ThemeProviderProps) {
  const [state, setState] = React.useState<ThemeProviderState>(() =>
    getInitialState(storageKey, defaultTheme)
  );

  React.useEffect(() => {
    const next = getInitialState(storageKey, defaultTheme);
    setState(next);
    applyTheme(next.resolved);
  }, [defaultTheme, storageKey]);

  React.useEffect(() => {
    applyTheme(state.resolved);
  }, [state.resolved]);

  const setTheme = React.useCallback(
    (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      const resolved = resolveTheme(theme);
      applyTheme(resolved, true);
      setState({ theme, resolved });
    },
    [storageKey]
  );

  const handleSystemChange = React.useCallback(() => {
    setState((prev) => {
      if (prev.theme !== "system") return prev;
      const resolved = resolveTheme("system");
      return { ...prev, resolved };
    });
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", handleSystemChange);
    return () => mq.removeEventListener("change", handleSystemChange);
  }, [handleSystemChange]);

  return (
    <ThemeProviderContext.Provider
      value={{ theme: state.theme, setTheme, resolved: state.resolved }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeProviderContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
