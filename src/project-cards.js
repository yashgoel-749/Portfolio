import { projects } from "./projects.js";

const illustrations = {
  syncsave: `<div class="mock-app sync-app"><div class="mock-sidebar"><b>✳ syncsave</b><span>⌂ Workspace</span><span>▤ Documents</span><span>♧ Shared with me</span><div class="mock-active">✎ Product brainstorm</div><small>YOUR WORKSPACE<br /><br />↳ Design notes<br /><br />↳ Sprint planning</small><div class="mock-profile">YG <span>Yash’s workspace</span></div></div><div class="mock-document"><div class="mock-toolbar"><span>Workspace / Product brainstorm</span><div class="mock-avatars"><i>Y</i><i>A</i><i>S</i><b>Share ↗</b></div></div><div class="editor-tools">↶ &nbsp; ↷ &nbsp; │ &nbsp; Heading &nbsp; │ &nbsp; <b>B</b> &nbsp; <i>I</i> &nbsp; ≡</div><div class="mock-page"><small>✳ LET’S BUILD SOMETHING GOOD</small><h4>Great ideas<br />start together.</h4><p>A space for our next big thing. Bring your ideas,<br />and let’s make them happen.</p><div class="mock-highlight">Build for people. Design for possibility.</div><div class="mock-cursor">↖ <span>Aditi</span></div><div class="mock-check">✓ &nbsp; Think beyond the obvious</div><div class="mock-check">✓ &nbsp; Make room for collaboration</div><div class="mock-lines"></div><span class="mock-saved">● All changes saved</span></div></div></div>`,
  linkflow: `<div class="mock-app link-app"><div class="mock-toolbar"><b>↗ linkflow</b><span>Overview &nbsp; Links &nbsp; Analytics</span><i class="mini-avatar">YG</i></div><div class="link-dashboard"><small>YOUR WORKSPACE, AT A GLANCE</small><div class="mock-title"><h4>Make every link count.</h4><b>+ Create link</b></div><div class="mini-stats"><div>Total clicks<strong>1,284</strong><small>↗ This month</small></div><div>Active links<strong>24</strong><small>Across your workspace</small></div><div>Unique visitors<strong>862</strong><small>Estimated visitors</small></div></div><div class="chart-title">Click activity <span>Last 7 days ⌄</span></div><div class="mock-chart"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="chart-days">MON <span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div><div class="mock-link-row">↗ &nbsp; portfolio.link/yash <span>Active ●</span></div></div></div>`,
  amazon: `<div class="mock-app shop-app"><div class="shop-nav"><b>amazon<span>⌣</span></b><div>Search your next favorite <span>⌕</span></div><small>Hello, Yash<br /><b>Account & Lists</b></small><strong>🛒</strong></div><div class="shop-subnav">☰ All &nbsp; &nbsp; Today’s deals &nbsp; &nbsp; Electronics &nbsp; &nbsp; Home & Kitchen</div><div class="shop-banner"><span>A LITTLE UPGRADE. A LOT OF JOY.</span><h4>Find your<br />everyday favorites.</h4><b>Discover more →</b><div class="product-headphones">∩</div></div><div class="shop-products"><div><b>Make room for sound.</b><div class="product-speaker">▥</div><small>Explore audio →</small></div><div><b>Your desk, upgraded.</b><div class="product-laptop">▱</div><small>Shop essentials →</small></div><div><b>Little things. Big difference.</b><div class="product-watch">▣</div><small>Find your favorites →</small></div></div></div>`,
};

export function renderProjectCards() {
  return projects
    .map(
      (project) => `
    <article class="project-card ${project.id === "syncsave" ? "project-featured" : ""}" data-category="${project.category}">
      <button class="project-visual ${project.color}" data-project="${project.id}" aria-label="Explore ${project.name} case study">
        <span class="visual-label">${project.id === "syncsave" ? "BUILT FOR BETTER TOGETHER" : project.id === "linkflow" ? "SMALL LINKS. BIG POSSIBILITIES." : "A FAMILIAR EXPERIENCE, REBUILT."}</span>
        <div class="mock-wrap" aria-hidden="true">${illustrations[project.id]}</div>
        <span class="preview-caption">ILLUSTRATED INTERFACE PREVIEW</span>
        <span class="project-open" aria-hidden="true">↗</span>
      </button>
      <div class="project-meta">
        <div>
          <p class="project-kicker">${project.number} / ${project.category === "real-time" ? "REAL-TIME COLLABORATION" : project.category === "backend" ? "LINK MANAGEMENT & ANALYTICS" : "FULL-STACK E-COMMERCE"}</p>
          <h3><button data-project="${project.id}">${project.name} <span aria-hidden="true">↗</span></button></h3>
          <p>${project.summary}</p>
          <a class="project-source" href="${project.source}" target="_blank" rel="noopener noreferrer">${project.name} source code <span aria-hidden="true">↗</span></a>
        </div>
        <div class="tech-tags">${project.stack.map((item) => `<span>${item}</span>`).join("")}</div>
      </div>
    </article>`,
    )
    .join("");
}
