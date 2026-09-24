import { expect, test, type Page } from "@playwright/test";
import {
  AUTH_FILE,
  discoverLinks,
  hasCredentials,
  MISSING_CREDENTIALS_MESSAGE,
  uniqueText,
} from "./helpers";

test.skip(!hasCredentials, MISSING_CREDENTIALS_MESSAGE);
test.use({ storageState: AUTH_FILE });

/** Card on the current page that contains the given text. */
const cardWithText = (page: Page, text: string) =>
  page.getByTestId("feed-card").filter({ hasText: text }).first();

async function openCardMenu(page: Page, text: string) {
  await cardWithText(page, text).getByTestId("menu-trigger-dots").first().click();
  return page.getByRole("menu");
}

async function createPost(page: Page, text: string) {
  await page.goto("/");
  await page.getByTestId("composer-trigger").first().click();
  const editor = page.getByRole("dialog").locator(".ProseMirror");
  await editor.click();
  await editor.pressSequentially(text);
  await page.getByTestId("composer-submit").click();
  await expect(page.getByText("Post published successfully")).toBeVisible();
  await expect(cardWithText(page, text)).toBeVisible();
  const feedId = await cardWithText(page, text).getAttribute("data-feed-id");
  expect(feedId).toBeTruthy();
  return feedId!;
}

async function deletePostIfPresent(page: Page, feedId: string) {
  const response = await page.goto(`/p/${feedId}`);
  if (response?.status() === 404) return;
  const card = page.locator(`[data-testid="feed-card"][data-feed-id="${feedId}"]`);
  if ((await card.count()) === 0) return;
  await card.getByTestId("menu-trigger-dots").first().click();
  await page.getByRole("menuitem", { name: "Delete post" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByText(/deleted successfully/)).toBeVisible();
}

test.describe.serial("authenticated feed flows", () => {
  const postText = uniqueText("post");
  let feedId: string | null = null;

  test.afterAll(async ({ browser }) => {
    if (!feedId) return;
    const context = await browser.newContext({ storageState: AUTH_FILE });
    const page = await context.newPage();
    try {
      await deletePostIfPresent(page, feedId);
    } finally {
      await context.close();
    }
  });

  test("create a post", async ({ page }) => {
    feedId = await createPost(page, postText);
  });

  test("comment on the post", async ({ page }) => {
    test.skip(!feedId, "post was not created");
    const commentText = uniqueText("comment");
    await page.goto(`/p/${feedId}`);
    await page.getByTestId("composer-trigger").first().click();
    const editor = page.getByRole("dialog").locator(".ProseMirror");
    await editor.click();
    await editor.pressSequentially(commentText);
    await page.getByTestId("composer-submit").click();
    await expect(page.getByText("Comment posted successfully")).toBeVisible();
    await expect(page.getByText(commentText)).toBeVisible();
    // The comment is removed with the post (ON DELETE CASCADE) in afterAll.
  });

  test("react to the post", async ({ page }) => {
    test.skip(!feedId, "post was not created");
    await page.goto(`/p/${feedId}`);
    const card = page.locator(`[data-testid="feed-card"][data-feed-id="${feedId}"]`);
    const like = card.getByTestId("react-like").first();
    await expect(like).toHaveAttribute("data-state", "neutral");
    await like.click();
    await expect(like).toHaveAttribute("data-state", "like");
    await expect(card.getByText("reactions")).toBeVisible();
    // Toggle back to neutral (removes the reaction row).
    await like.click();
    await expect(like).toHaveAttribute("data-state", "neutral");
  });

  test("save the post to the collection and remove it", async ({ page }) => {
    test.skip(!feedId, "post was not created");
    await page.goto("/");
    let menu = await openCardMenu(page, postText);
    await menu.getByRole("menuitem", { name: "Save post" }).click();
    await expect(page.getByText("Post saved successfully")).toBeVisible();

    menu = await openCardMenu(page, postText);
    await menu.getByRole("menuitem", { name: "Remove from saved" }).click();
    await expect(page.getByText("Removed from saved")).toBeVisible();
  });

  test("delete the post", async ({ page }) => {
    test.skip(!feedId, "post was not created");
    await deletePostIfPresent(page, feedId!);
    const response = await page.goto(`/p/${feedId}`);
    expect(response?.status()).toBe(404);
    feedId = null;
  });
});

test("follow and unfollow another user", async ({ page }) => {
  const { profileHref } = await discoverLinks(page);
  test.skip(!profileHref, "No other user's profile on the home feed to follow.");
  await page.goto(profileHref!);
  const followButton = page.getByTestId("follow-button").first();
  test.skip((await followButton.count()) === 0, "Discovered profile is the test user's own profile.");

  const initiallyFollowing = (await followButton.innerText()).trim() === "Following";
  await followButton.click();
  await expect(followButton).toHaveText(initiallyFollowing ? "Follow" : "Following");
  // Restore the original state.
  await followButton.click();
  await expect(followButton).toHaveText(initiallyFollowing ? "Following" : "Follow");
});

test("edit profile bio in settings and restore it", async ({ page }) => {
  await page.goto("/settings/edit-profile");
  const bio = page.locator('textarea[name="description"]');
  await expect(bio).toBeVisible();
  const original = await bio.inputValue();
  const updated = uniqueText("bio");

  const username = await page.locator('input[name="full_name"]').inputValue();
  test.skip(
    username.trim().length < 5,
    "Test user has no username yet; saving the profile would require choosing one.",
  );

  const save = async (value: string) => {
    await page.locator('textarea[name="description"]').fill(value);
    // The form calls a server action (POST to this page), then reloads.
    const saved = page.waitForResponse(
      (res) => res.request().method() === "POST" && res.url().includes("/settings/edit-profile"),
    );
    await page.getByRole("button", { name: "Save", exact: true }).click();
    expect((await saved).ok()).toBeTruthy();
    await page.waitForLoadState("load");
  };

  try {
    await save(updated);
    await page.reload();
    await expect(page.locator('textarea[name="description"]')).toHaveValue(updated);
  } finally {
    await page.goto("/settings/edit-profile");
    await save(original);
  }
});
