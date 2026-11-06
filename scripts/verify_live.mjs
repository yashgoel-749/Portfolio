import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const site = "https://goel-yash-homeground.vercel.app/";
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => errors.push(request.url()));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  const response = await page.goto(site);
  assert.equal(response.status(), 200);
  assert.ok(
    response.headers()["content-security-policy"],
    "Security policy is present on the live deployment",
  );
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute("href"),
    site,
  );
  assert.equal(
    await page.locator('meta[property="og:image"]').getAttribute("content"),
    `${site}social-card.jpg`,
  );
  assert.equal(
    await page.locator('meta[name="twitter:image"]').getAttribute("content"),
    `${site}social-card.jpg`,
  );
  const image = await page.request.get(`${site}social-card.jpg`);
  assert.equal(image.status(), 200);
  assert.ok(image.headers()["content-type"].includes("image/jpeg"));
  await page.getByRole("button", { name: "Backend & APIs" }).click();
  assert.equal(await page.locator(".project-card:visible").count(), 1);
  await page
    .getByRole("button", { name: "Explore LinkFlow case study" })
    .click();
  assert.equal(await page.getByRole("dialog").isVisible(), true);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.reload();
  assert.equal(
    await page
      .getByRole("button", { name: "Switch to light theme" })
      .isVisible(),
    true,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  assert.equal(await page.getByRole("navigation").isVisible(), true);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "About me" })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Toggle navigation" })
      .getAttribute("aria-expanded"),
    "false",
  );
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  const resume = await page.request.get(`${site}Yash_Goel_Resume.pdf`);
  assert.equal(resume.status(), 200);
  assert.equal((await resume.body()).subarray(0, 4).toString(), "%PDF");
  assert.deepEqual(errors, []);
  console.log(
    `PASS ${site}\nLive metadata, sharing image, assets, security headers, projects, theme persistence, mobile navigation, and resume verified.`,
  );
} finally {
  await browser.close();
}
