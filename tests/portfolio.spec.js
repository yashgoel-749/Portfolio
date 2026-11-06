import { test, expect } from "@playwright/test";

test("project discovery, filters, case studies, and resume work", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "CODE WITH",
  );
  await expect(page.locator(".project-card:visible")).toHaveCount(3);
  await page.getByRole("button", { name: "Backend & APIs" }).click();
  await expect(page.locator(".project-card:visible")).toHaveCount(1);
  await expect(page.locator(".project-card:visible")).toContainText("LinkFlow");
  await page
    .getByRole("button", { name: "Explore LinkFlow case study" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("HttpOnly");
  await expect(page.getByRole("link", { name: "View source" })).toHaveAttribute(
    "href",
    "https://github.com/yashgoel-749/linkflow",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Explore LinkFlow case study" }),
  ).toBeFocused();
  await page.getByRole("button", { name: /All projects/ }).click();
  await expect(page.locator(".project-card:visible")).toHaveCount(3);
  await page
    .getByRole("button", { name: "Explore Amazon Clone case study" })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "not a real payment integration",
  );
  await page.getByRole("button", { name: "Close case study" }).click();
  const resume = await page.request.get("/Yash_Goel_Resume.pdf");
  expect(resume.ok()).toBeTruthy();
  expect((await resume.body()).subarray(0, 4).toString()).toBe("%PDF");
  await expect(page.locator(".portrait-frame img")).toHaveJSProperty(
    "naturalWidth",
    448,
  );
  expect(errors).toEqual([]);
});

test("theme preference survives a reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Switch to light theme" }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("copy email writes the verified address", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Clipboard permission grants are Chromium-specific; fallback is covered in every browser.",
  );
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.getByRole("status")).toHaveText("Copied!");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "goelyash749@gmail.com",
  );
});

for (const width of [320, 360, 390, 768, 1440]) {
  test(`layout fits ${width}px and navigation is usable`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    if (width < 600) {
      await page.getByRole("button", { name: "Toggle navigation" }).click();
      await expect(page.getByRole("navigation")).toBeVisible();
      await page
        .getByRole("navigation")
        .getByRole("link", { name: "About me" })
        .click();
      await expect(
        page.getByRole("button", { name: "Toggle navigation" }),
      ).toHaveAttribute("aria-expanded", "false");
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: testInfo.outputPath(`portfolio-${width}.png`),
      fullPage: true,
    });
  });
}
