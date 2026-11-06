import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  for (const theme of ["light", "dark"]) {
    test(`accessible page at ${width}px in ${theme} theme`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      if (theme === "dark") {
        await page
          .getByRole("button", { name: "Switch to dark theme" })
          .click();
      }
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map(({ id, nodes }) => ({
          id,
          nodes: nodes.map(({ target, failureSummary }) => ({
            target,
            failureSummary,
          })),
        })),
      ).toEqual([]);
    });
  }
}

test("accessible case study and keyboard focus stays inside the dialog", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Explore SyncSave case study" })
    .click();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map(({ id, nodes }) => ({
      id,
      nodes: nodes.map(({ target, failureSummary }) => ({
        target,
        failureSummary,
      })),
    })),
  ).toEqual([]);
  for (let index = 0; index < 6; index++) {
    await page.keyboard.press("Tab");
    // Browsers may include their chrome in the Tab cycle; background controls stay inert.
    expect(
      await page.evaluate(
        () =>
          document.activeElement === document.body ||
          !!document.activeElement.closest("dialog"),
      ),
    ).toBeTruthy();
  }
});

test("keyboard users can skip navigation and use the expanded mobile menu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map(({ id, nodes }) => ({
      id,
      nodes: nodes.map(({ target, failureSummary }) => ({
        target,
        failureSummary,
      })),
    })),
  ).toEqual([]);
});
