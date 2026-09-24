import { expect, test, type Locator, type Page } from "@playwright/test";
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

// ------------------------------------------------ privacy, hide, block, report
// These flows need migration 20260925100000_hide_block_report_privacy.sql.
// Before it is applied the app answers with a "feature unavailable" message,
// and the tests skip instead of failing.
const UNAVAILABLE = /unavailable until the database is updated/i;

/**
 * Waits for the expected result of an action, or for the "feature unavailable"
 * message (migration not applied), and skips the test in the latter case.
 */
async function expectOrSkipUnavailable(page: Page, expected: Locator) {
  const notice = page.getByText(UNAVAILABLE).first();
  await expect(expected.or(notice).first()).toBeVisible();
  if (await notice.isVisible().catch(() => false)) {
    test.skip(true, "Database migration 20260925100000 is not applied yet.");
  }
}

/** First card on the home feed written by another user (its menu offers "Block"). */
async function findOtherUsersCard(page: Page) {
  await page.goto("/");
  const cards = page.getByTestId("feed-card");
  await cards.first().waitFor({ state: "visible", timeout: 10_000 }).catch(() => undefined);
  const count = Math.min(await cards.count(), 10);
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    await card.getByTestId("menu-trigger-dots").first().click();
    const isOther = await page
      .getByRole("menuitem", { name: "Block" })
      .isVisible()
      .catch(() => false);
    await page.keyboard.press("Escape");
    if (isOther) {
      const feedId = await card.getAttribute("data-feed-id");
      const profileHref = await card.locator('a[href^="/u/"]').last().getAttribute("href");
      return { feedId: feedId!, profileHref };
    }
  }
  return null;
}

const cardById = (page: Page, feedId: string) =>
  page.locator(`[data-testid="feed-card"][data-feed-id="${feedId}"]`);

test.describe.serial("privacy settings and post audience", () => {
  test("privacy settings persist and preselect the composer audience", async ({ page }) => {
    await page.goto("/settings/privacy");
    await expect(page.getByRole("heading", { name: "Privacy" })).toBeVisible();
    await expectOrSkipUnavailable(page, page.getByTestId("privacy-settings"));

    const audience = page.getByRole("radiogroup", { name: "Default audience for new posts" });
    const original = await audience.getByRole("radio", { checked: true }).getAttribute("value");
    const save = async (value: string) => {
      await page.goto("/settings/privacy");
      await audience.locator(`[role="radio"][value="${value}"]`).click();
      await page.getByRole("button", { name: "Save", exact: true }).click();
      await expect(page.getByText("Privacy settings saved")).toBeVisible();
    };

    try {
      await save("follow");
      await page.reload();
      await expect(audience.locator('[role="radio"][value="follow"]')).toHaveAttribute(
        "data-state",
        "checked",
      );

      await page.goto("/");
      await page.getByTestId("composer-trigger").first().click();
      await expect(page.getByRole("dialog").getByTestId("composer-privacy")).toHaveText(/Followers/);
      await page.keyboard.press("Escape");
    } finally {
      await save(original ?? "public");
    }
  });

  test("a post shared with 'Only me' shows its audience", async ({ page }) => {
    const text = uniqueText("only me");
    await page.goto("/");
    await page.getByTestId("composer-trigger").first().click();
    const dialog = page.getByRole("dialog");
    await dialog.getByTestId("composer-privacy").click();
    await page.getByRole("option", { name: "Only me" }).click();
    const editor = dialog.locator(".ProseMirror");
    await editor.click();
    await editor.pressSequentially(text);
    await page.getByTestId("composer-submit").click();
    await expect(page.getByText("Post published successfully")).toBeVisible();
    const card = cardWithText(page, text);
    await expect(card.getByTestId("feed-privacy")).toHaveAttribute("aria-label", "Only me");
    const feedId = await card.getAttribute("data-feed-id");
    await deletePostIfPresent(page, feedId!);
  });
});

test.describe.serial("hide, report and block", () => {
  test("hide another user's post, undo, then unhide it from the post page", async ({ page }) => {
    const target = await findOtherUsersCard(page);
    test.skip(!target, "No post by another user on the home feed.");
    const card = cardById(page, target!.feedId);

    await card.getByTestId("menu-trigger-dots").first().click();
    await page.getByRole("menuitem", { name: "Hide post" }).click();
    await expectOrSkipUnavailable(page, page.getByTestId("feed-hidden"));
    const hidden = page.getByTestId("feed-hidden").filter({ hasText: "Post hidden" });
    await expect(hidden).toBeVisible();
    await hidden.getByRole("button", { name: "Undo" }).click();
    await expect(card.getByTestId("feed-privacy")).toBeVisible();

    // Hide again: the post stays hidden after a reload.
    await card.getByTestId("menu-trigger-dots").first().click();
    await page.getByRole("menuitem", { name: "Hide post" }).click();
    await expect(page.getByTestId("feed-hidden")).toBeVisible();
    await page.reload();
    await expect(page.getByText("For you").first()).toBeVisible();
    await expect(cardById(page, target!.feedId)).toHaveCount(0);

    // The post page offers to unhide it.
    await page.goto(`/p/${target!.feedId}`);
    await expect(page.getByText("You hid this post")).toBeVisible();
    await page.getByRole("button", { name: "Unhide" }).click();
    await expect(cardById(page, target!.feedId)).toBeVisible();
  });

  test("report another user's post once", async ({ page }) => {
    const target = await findOtherUsersCard(page);
    test.skip(!target, "No post by another user on the home feed.");
    const report = async () => {
      await cardById(page, target!.feedId).getByTestId("menu-trigger-dots").first().click();
      await page.getByRole("menuitem", { name: "Report" }).click();
      const dialog = page.getByRole("dialog");
      await expect(dialog.getByText("Report post")).toBeVisible();
      await dialog.getByRole("radio", { name: "Spam" }).click();
      await dialog.getByPlaceholder("Add details (optional)").fill(uniqueText("report"));
      await dialog.getByRole("button", { name: "Submit report" }).click();
    };

    await report();
    // The test account may have reported this post in an earlier run.
    await expectOrSkipUnavailable(
      page,
      page.getByText(/Thanks for reporting|You already reported this post/),
    );

    await page.keyboard.press("Escape");
    await report();
    await expect(page.getByText("You already reported this post").first()).toBeVisible();
  });

  test("block a user, see them in settings, then unblock", async ({ page }) => {
    const target = await findOtherUsersCard(page);
    test.skip(!target?.profileHref, "No post by another user on the home feed.");

    // Blocking removes follows; remember the state to restore it afterwards.
    await page.goto(target!.profileHref!);
    const followButton = page.getByTestId("follow-button").first();
    await expect(followButton).toBeVisible();
    const wasFollowing = (await followButton.innerText()).trim() === "Following";

    await page.goto("/");
    await cardById(page, target!.feedId).getByTestId("menu-trigger-dots").first().click();
    await page.getByRole("menuitem", { name: "Block" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText(/^Block .+\?$/)).toBeVisible();
    await dialog.getByRole("button", { name: "Block", exact: true }).click();
    await expectOrSkipUnavailable(page, page.getByText(/ blocked$/));
    await expect(cardById(page, target!.feedId)).toHaveCount(0);

    try {
      await page.goto("/settings/blocked-users");
      await expect(page.getByRole("heading", { name: "Blocked users" })).toBeVisible();
      await expect(page.getByTestId("blocked-user").first()).toBeVisible();

      // The blocked profile no longer offers Follow.
      await page.goto(target!.profileHref!);
      await expect(page.getByText("You blocked this user")).toBeVisible();
      await expect(page.getByTestId("follow-button")).toHaveCount(0);
    } finally {
      await page.goto(target!.profileHref!);
      await page.getByRole("button", { name: "Unblock" }).click();
      await expect(page.getByText(/ unblocked$/).first()).toBeVisible();
      await expect(page.getByTestId("follow-button").first()).toBeVisible();
      if (wasFollowing) {
        await page.getByTestId("follow-button").first().click();
        await expect(page.getByTestId("follow-button").first()).toHaveText("Following");
      }
    }
  });
});
