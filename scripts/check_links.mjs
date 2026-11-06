import { readFile } from "node:fs/promises";
import { projects } from "../src/projects.js";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const links = new Set([
  ...[...html.matchAll(/href="(https:\/\/[^\"]+)"/g)].map((match) => match[1]),
  ...projects.flatMap((project) =>
    [project.source, project.demo].filter(Boolean),
  ),
]);
let broken = false;
const results = await Promise.all(
  [...links].map(async (url) => {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30000),
        headers: { "User-Agent": "Portfolio-Link-Check/1.0" },
      });
      await response.body?.cancel();
      if (response.ok) return `OK ${response.status} ${url}`;
      if ([401, 403, 429, 999].includes(response.status))
        return `MANUAL CHECK ${response.status} ${url} (site restricts automated requests)`;
      broken = true;
      return `FAILED ${response.status} ${url}`;
    } catch (error) {
      broken = true;
      return `FAILED ${url}: ${error.message}`;
    }
  }),
);
console.log(results.join("\n"));
process.exitCode = broken ? 1 : 0;
