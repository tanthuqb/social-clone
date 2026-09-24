import { test as setup } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { AUTH_FILE, hasCredentials, loginViaUi, MISSING_CREDENTIALS_MESSAGE } from "./helpers";

setup("authenticate test user", async ({ page }) => {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  if (!hasCredentials) {
    // Keep dependent projects runnable; authenticated specs skip themselves.
    fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies: [], origins: [] }));
    setup.skip(true, MISSING_CREDENTIALS_MESSAGE);
    return;
  }
  await loginViaUi(page);
  await page.context().storageState({ path: AUTH_FILE });
});
