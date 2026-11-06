// Apply the stored theme before the stylesheet paints to avoid a light-mode flash.
try {
  const theme = localStorage.getItem("portfolio-theme");
  if (theme === "dark") document.documentElement.dataset.theme = theme;
} catch {
  // Storage may be unavailable in private or restricted browser contexts.
}
