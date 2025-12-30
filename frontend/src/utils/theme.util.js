const STORAGE_KEY = "pastebin_lite_theme";

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function getTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

export function setTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}

export function initTheme() {
  const theme = getTheme();
  applyTheme(theme);
  return theme;
}
