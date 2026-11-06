import { defineConfig } from "vite";
import { renderProjectCards } from "./src/project-cards.js";

export default defineConfig({
  plugins: [
    {
      name: "static-project-content",
      transformIndexHtml(html) {
        return html.replace("<!-- project-cards -->", renderProjectCards());
      },
    },
  ],
});
