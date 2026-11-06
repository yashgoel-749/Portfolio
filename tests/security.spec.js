import { readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";

const hosting = JSON.parse(
  await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
);
const securityHeaders = Object.fromEntries(
  hosting.headers[0].headers.map(({ key, value }) => [key, value]),
);

test("the configured production security policy allows assets and interactive features", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.policyViolations = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      window.policyViolations.push(
        `${event.violatedDirective}: ${event.blockedURI}`,
      );
    });
  });
  await page.route("**/*", async (route) => {
    if (route.request().resourceType() !== "document") return route.continue();
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: { ...response.headers(), ...securityHeaders },
    });
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(
    page.getByRole("button", { name: "Switch to light theme" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Explore SyncSave case study" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open live demo" }),
  ).toHaveAttribute("href", "https://syncsave.vercel.app");
  await page.keyboard.press("Escape");
  expect(await page.evaluate(() => window.policyViolations)).toEqual([]);
  expect(errors).toEqual([]);
});

test("the resume download saves a PDF and unavailable demos are not offered", async ({
  page,
}) => {
  await page.goto("/");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download résumé" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("Yash_Goel_Resume.pdf");
  expect(await download.failure()).toBeNull();
  const content = await readFile(await download.path());
  expect(content.subarray(0, 4).toString()).toBe("%PDF");
  await page
    .getByRole("button", { name: "Explore Amazon Clone case study" })
    .click();
  await expect(page.getByRole("link", { name: "Open live demo" })).toHaveCount(
    0,
  );
  await expect(page.getByRole("dialog")).toContainText("currently disabled");
  await expect(page.getByRole("link", { name: "View source" })).toHaveAttribute(
    "href",
    "https://github.com/yashgoel-749/clone",
  );
});
