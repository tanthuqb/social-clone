import { expect, type Page } from "@playwright/test";
import path from "node:path";

export const AUTH_FILE = path.join(import.meta.dirname, "..", "playwright", ".auth", "user.json");

export const E2E_EMAIL = process.env.E2E_USER_EMAIL ?? "";
export const E2E_PASSWORD = process.env.E2E_USER_PASSWORD ?? "";
export const hasCredentials = Boolean(E2E_EMAIL && E2E_PASSWORD);
export const MISSING_CREDENTIALS_MESSAGE =
  "E2E_USER_EMAIL / E2E_USER_PASSWORD are not set: skipping authenticated flows " +
  "(use a dedicated, confirmed test account).";

/** Unique, recognizable marker for data created by a test run. */
export function uniqueText(label: string) {
  return `e2e ${label} ${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Open the login modal the way a guest would (sidebar "Create Post"). */
export async function openLoginModal(page: Page) {
  await page.getByTitle("Create Post").locator("visible=true").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Welcome to SuZu!")).toBeVisible();
  return dialog;
}

/** Log in through the UI login modal. */
export async function loginViaUi(page: Page, email = E2E_EMAIL, password = E2E_PASSWORD) {
  await page.goto("/");
  const dialog = await openLoginModal(page);
  await dialog.getByPlaceholder("Enter email").fill(email);
  await dialog.getByPlaceholder("Enter password").fill(password);
  await dialog.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(dialog).toBeHidden();
  // Signed-in users see the inline composer on the home page.
  await expect(page.getByTestId("composer-trigger").first()).toBeVisible();
}

export type DiscoveredLinks = { feedHref: string | null; profileHref: string | null };

/** Discover a real feed detail URL and author profile URL from the home feed. */
export async function discoverLinks(page: Page): Promise<DiscoveredLinks> {
  await page.goto("/");
  await expect(page.getByText("For you").first()).toBeVisible();
  const feedCards = page.getByTestId("feed-card");
  // Give the feed a moment to render (it is server-rendered, so usually instant).
  await feedCards.first().waitFor({ state: "visible", timeout: 10_000 }).catch(() => undefined);
  if ((await feedCards.count()) === 0) return { feedHref: null, profileHref: null };

  const card = feedCards.first();
  const feedHref = await card
    .locator('a[href^="/p/"]')
    .first()
    .getAttribute("href")
    .catch(() => null);
  const profileHrefs = await card
    .locator('a[href^="/u/"]')
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
  const profileHref =
    profileHrefs.find((href) => href && !/\/u\/(null|undefined)$/.test(href)) ?? null;
  return { feedHref, profileHref };
}
