const projectRoot = document.documentElement;
const projectThemeToggle = document.querySelector("[data-theme-toggle]");
const projectThemeLabel = document.querySelector("[data-theme-label]");
const projectThemeQuery = window.matchMedia("(prefers-color-scheme: light)");
const projectSavedTheme = localStorage.getItem("govind-project-theme");

function applyProjectTheme(theme) {
  projectRoot.dataset.theme = theme;

  if (projectThemeToggle) {
    projectThemeToggle.checked = theme === "light";
  }

  if (projectThemeLabel) {
    projectThemeLabel.textContent = theme === "light" ? "Light mode" : "Dark mode";
  }
}

applyProjectTheme(projectSavedTheme || (projectThemeQuery.matches ? "light" : "dark"));

if (projectThemeToggle) {
  projectThemeToggle.addEventListener("change", () => {
    const nextTheme = projectThemeToggle.checked ? "light" : "dark";
    localStorage.setItem("govind-project-theme", nextTheme);
    applyProjectTheme(nextTheme);
  });
}

projectThemeQuery.addEventListener("change", (event) => {
  if (localStorage.getItem("govind-project-theme")) {
    return;
  }

  applyProjectTheme(event.matches ? "light" : "dark");
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});
