import { test, expect } from "@playwright/test";

test("search and sharing metadata use the public deployment and a valid image", async ({
  page,
}) => {
  await page.goto("/");
  const site = "https://goel-yash-homeground.vercel.app/";
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    site,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    site,
  );
  for (const selector of [
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
  ]) {
    await expect(page.locator(selector)).toHaveAttribute(
      "content",
      `${site}social-card.jpg`,
    );
  }
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    /Yash Goel/,
  );
  const image = await page.request.get("/social-card.jpg");
  expect(image.ok()).toBeTruthy();
  expect(image.headers()["content-type"]).toContain("image/jpeg");
  expect([...(await image.body()).subarray(0, 2)]).toEqual([0xff, 0xd8]);
});
