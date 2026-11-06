import "./fonts.css";
import "./style.css";
import { projects } from "./projects.js";

const grid = document.querySelector("#project-grid");
document.documentElement.classList.add("interactive");

const dialog = document.querySelector("#project-dialog");
const dialogContent = document.querySelector("#dialog-content");
let dialogTrigger;
grid.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-project]");
  if (!trigger) return;
  const project = projects.find((item) => item.id === trigger.dataset.project);
  dialogTrigger = trigger;
  dialogContent.innerHTML = `<p class="eyebrow">PROJECT ${project.number} / ENGINEERING NOTES</p><h2 id="dialog-title">${project.name}</h2><p class="dialog-summary">${project.summary}</p><div class="tech-tags">${project.stack.map((item) => `<span>${item}</span>`).join("")}</div><h3>The challenge</h3><p>${project.challenge}</p><h3>What I built</h3><p>${project.solution}</p><h3>Under the hood</h3><ul>${project.highlights.map((item) => `<li>${item}</li>`).join("")}</ul><div class="dialog-links"><a class="button" href="${project.source}" target="_blank" rel="noopener noreferrer">View source ↗</a>${project.demo ? `<a class="text-link" href="${project.demo}" target="_blank" rel="noopener noreferrer">Open live demo ↗</a>` : ""}</div>${project.demo || project.demoNote ? `<small class="demo-note">${project.demoNote || "External demos may take a moment to wake up. Source code is available on GitHub."}</small>` : ""}`;
  dialog.showModal();
});
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (
    event.target === dialog &&
    (event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom)
  )
    dialog.close();
});
dialog.addEventListener("close", () => dialogTrigger?.focus());

document
  .querySelector(".project-filters")
  .addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    document
      .querySelectorAll("[data-filter]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    let count = 0;
    document.querySelectorAll(".project-card").forEach((card) => {
      card.hidden =
        button.dataset.filter !== "all" &&
        card.dataset.category !== button.dataset.filter;
      if (!card.hidden) count++;
    });
    document.querySelector("#filter-status").textContent =
      `${count} ${count === 1 ? "project" : "projects"} shown`;
  });

const themeButton = document.querySelector(".theme-toggle");
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute(
    "aria-label",
    `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
  );
}
try {
  applyTheme(localStorage.getItem("portfolio-theme") || "light");
} catch {
  applyTheme("light");
}
themeButton.addEventListener("click", () => {
  const theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch {
    /* Theme remains usable without storage. */
  }
});

const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
const desktopLayout = matchMedia("(min-width: 601px)");
desktopLayout.addEventListener("change", () => closeMenu());

const motionButton = document.querySelector(".motion-toggle");
motionButton.addEventListener("click", () => {
  const paused = motionButton.getAttribute("aria-pressed") !== "true";
  motionButton.setAttribute("aria-pressed", String(paused));
  motionButton.setAttribute(
    "aria-label",
    paused ? "Resume moving banner" : "Pause moving banner",
  );
  motionButton.textContent = paused ? "▶" : "Ⅱ";
  document.querySelector(".ticker").classList.toggle("is-paused", paused);
});

document.querySelector(".copy-email").addEventListener("click", async () => {
  const status = document.querySelector("#copy-status");
  try {
    await navigator.clipboard.writeText("goelyash749@gmail.com");
    status.textContent = "Copied!";
  } catch {
    status.textContent =
      "Select the email to copy, or click it to write to me.";
  }
});
document.querySelector("#year").textContent = new Date().getFullYear();

if (
  "IntersectionObserver" in window &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((item) => {
    item.classList.add("will-reveal");
    observer.observe(item);
  });
}
const progress = document.querySelector(".scroll-progress");
let progressPending = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  progressPending = false;
}
addEventListener(
  "scroll",
  () => {
    if (!progressPending) {
      progressPending = true;
      requestAnimationFrame(updateProgress);
    }
  },
  { passive: true },
);
addEventListener("resize", updateProgress);
updateProgress();
