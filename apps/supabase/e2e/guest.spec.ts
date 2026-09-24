import { expect, test } from "@playwright/test";
import { discoverLinks, openLoginModal } from "./helpers";

test.describe("guest", () => {
  test("home feed renders for guests", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.getByText("For you").first()).toBeVisible();
    // Primary navigation is available to guests.
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
    await expect(page.getByTitle("Create Post").locator("visible=true").first()).toBeVisible();
    // Guests do not get the inline composer.
    await expect(page.getByTestId("composer-trigger")).toHaveCount(0);
  });

  test("login modal opens and validates input", async ({ page }) => {
    await page.goto("/");
    const dialog = await openLoginModal(page);
    await expect(dialog.getByText("Log in", { exact: true }).first()).toBeVisible();

    const submit = dialog.getByRole("button", { name: "Log in", exact: true });
    // Submitting is disabled while the form is empty.
    await expect(submit).toBeDisabled();

    await dialog.getByPlaceholder("Enter email").fill("not-an-email");
    await dialog.getByPlaceholder("Enter password").fill("123");
    await expect(submit).toBeEnabled();
    await submit.click();

    await expect(
      dialog.getByText("Please enter a valid email address, e.g. admin@example.com"),
    ).toBeVisible();
    await expect(dialog.getByText("Password must be at least 5 characters.")).toBeVisible();
    // Still on the login modal (nothing was submitted).
    await expect(dialog.getByText("Welcome to SuZu!")).toBeVisible();
  });

  test("unknown route shows the 404 page", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist-e2e");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "404 - Page not found" })).toBeVisible();
    await page.getByRole("link", { name: /Back to home/ }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  // These routes stream behind (outside)/loading.tsx, so Next.js has already
  // sent a 200 when notFound() runs; it renders the 404 UI and marks the page
  // noindex instead of changing the status code.
  const expectStreamed404 = async (page: import("@playwright/test").Page) => {
    await expect(page.getByRole("heading", { name: "404 - Page not found" })).toBeVisible();
    await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
  };

  test("unknown profile shows the 404 page", async ({ page }) => {
    await page.goto(`/u/e2e-no-such-user-${Date.now()}`);
    await expectStreamed404(page);
  });

  test("unknown feed shows the 404 page", async ({ page }) => {
    await page.goto("/p/00000000-0000-4000-8000-000000000000");
    await expectStreamed404(page);
  });

  test("public profile page renders (discovered from the feed)", async ({ page }) => {
    const { profileHref } = await discoverLinks(page);
    test.skip(!profileHref, "No posts with an author profile link on the home feed (empty database).");
    const response = await page.goto(profileHref!);
    expect(response?.status()).toBe(200);
    await expect(page.getByText(/^@/).first()).toBeVisible();
    await expect(page.getByText("404 - Page not found")).toHaveCount(0);
  });

  test("feed detail page renders (discovered from the feed)", async ({ page }) => {
    const { feedHref } = await discoverLinks(page);
    test.skip(!feedHref, "No posts on the home feed (empty database).");
    const response = await page.goto(feedHref!);
    expect(response?.status()).toBe(200);
    const feedId = feedHref!.split("/").pop();
    await expect(page.locator(`[data-testid="feed-card"][data-feed-id="${feedId}"]`)).toBeVisible();
    // Guests are invited to join instead of getting a comment composer.
    await expect(page.getByText("SuZu to join the discussion...")).toBeVisible();
  });

  test("settings pages require login", async ({ page }) => {
    await page.goto("/settings/edit-profile");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("For you").first()).toBeVisible();
  });

  for (const path of ["/settings/privacy", "/settings/blocked-users", "/settings/policy-security"]) {
    test(`privacy settings require login (${path})`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByText("For you").first()).toBeVisible();
    });
  }

  test("posts show their audience", async ({ page }) => {
    await page.goto("/");
    const cards = page.getByTestId("feed-card");
    await cards.first().waitFor({ state: "visible", timeout: 10_000 }).catch(() => undefined);
    test.skip((await cards.count()) === 0, "No posts on the home feed (empty database).");
    await expect(cards.first().getByTestId("feed-privacy")).toHaveAttribute(
      "aria-label",
      /^(Public|Followers|Only me)$/,
    );
  });

  test("hide, block and report ask guests to log in", async ({ page }) => {
    await page.goto("/");
    const cards = page.getByTestId("feed-card");
    await cards.first().waitFor({ state: "visible", timeout: 10_000 }).catch(() => undefined);
    test.skip((await cards.count()) === 0, "No posts on the home feed (empty database).");
    for (const item of ["Hide post", "Block", "Report"]) {
      await cards.first().getByTestId("menu-trigger-dots").first().click();
      await page.getByRole("menuitem", { name: item }).click();
      const dialog = page.getByRole("dialog");
      await expect(dialog.getByText("Welcome to SuZu!")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
    }
  });
});
