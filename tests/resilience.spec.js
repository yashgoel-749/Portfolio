import { test, expect } from "@playwright/test";

test("every category shows the right project and dialog closes by clicking outside", async ({
  page,
}) => {
  await page.goto("/");
  for (const [category, project] of [
    ["Real-time", "SyncSave"],
    ["Backend & APIs", "LinkFlow"],
    ["E-commerce", "Amazon Clone"],
  ]) {
    await page.getByRole("button", { name: category, exact: true }).click();
    await expect(page.locator(".project-card:visible")).toHaveCount(1);
    await expect(
      page.locator(".project-card:visible").getByRole("heading"),
    ).toContainText(project);
  }
  await page
    .getByRole("button", { name: "Explore Amazon Clone case study" })
    .click();
  await page.mouse.click(5, 5);
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("page loads all assets locally and every section link has a target", async ({
  page,
}) => {
  const failures = [];
  const externalRequests = [];
  page.on("requestfailed", (request) => failures.push(request.url()));
  page.on("response", (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()} ${response.url()}`);
  });
  await page.route("**/*", (route) => {
    if (new URL(route.request().url()).origin !== "http://127.0.0.1:4173") {
      externalRequests.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const missingTargets = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .filter(
          (link) => link.hash && !document.getElementById(link.hash.slice(1)),
        )
        .map((link) => link.hash),
    );
  expect(missingTargets).toEqual([]);
  expect(externalRequests).toEqual([]);
  expect(failures).toEqual([]);
  expect(
    await page.evaluate(() =>
      [...document.fonts]
        .filter((font) => font.status === "loaded")
        .map((font) => font.family),
    ),
  ).toEqual(expect.arrayContaining(["Barlow Condensed", "DM Sans Variable"]));
});

test("content, source links, navigation, and resume remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173");
  await expect(page.getByRole("heading", { name: "SyncSave" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "SyncSave source code" }),
  ).toHaveAttribute("href", "https://github.com/yashgoel-749/SyncSave");
  await expect(
    page.getByRole("link", { name: "LinkFlow source code" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Amazon Clone source code" }),
  ).toBeVisible();
  await expect(page.getByRole("navigation")).toBeVisible();
  const response = await page.request.get(
    "http://127.0.0.1:4173/Yash_Goel_Resume.pdf",
  );
  expect((await response.body()).subarray(0, 4).toString()).toBe("%PDF");
  await context.close();
});

test("restricted storage and clipboard leave useful controls and contact fallback", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    });
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new DOMException("Denied", "NotAllowedError");
        },
      },
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(
    page.getByRole("button", { name: "Switch to light theme" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Select the email to copy",
  );
  await expect(
    page.getByRole("link", { name: "goelyash749@gmail.com", exact: true }),
  ).toHaveAttribute("href", "mailto:goelyash749@gmail.com");
  expect(errors).toEqual([]);
});

test("moving banner can be paused and reduced-motion preference disables animation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause moving banner" }).click();
  await expect(
    page.getByRole("button", { name: "Resume moving banner" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    await page
      .locator(".ticker > div")
      .evaluate((element) => getComputedStyle(element).animationPlayState),
  ).toBe("paused");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".ticker > div")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  await expect(
    page.getByRole("button", { name: "Resume moving banner" }),
  ).not.toBeVisible();
});

test("mobile navigation closes on Escape and after switching to desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const button = page.getByRole("button", {
    name: "Toggle navigation",
    includeHidden: true,
  });
  await button.click();
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await button.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(button).not.toBeVisible();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("navigation")).not.toBeVisible();
});
