import { test, expect } from "@playwright/test";

test("singleplayer: place die, bot responds, scores update", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByTestId("btn-singleplayer").click();
  await expect(page).toHaveURL("/singleplayer");

  // Wait for socket to connect (create button becomes enabled)
  await expect(page.getByTestId("btn-create-game")).not.toBeDisabled({
    timeout: 10_000,
  });

  await page.getByTestId("input-player-name").fill("TestPlayer");
  await page.getByTestId("btn-create-game").click();

  // Wait for redirect to game page
  await expect(page).toHaveURL(/\/[a-zA-Z0-9-]+$/, { timeout: 15_000 });

  // Wait for game to start — turn-status visible with "your move"
  const turnStatus = page.getByTestId("turn-status");
  await expect(turnStatus).toBeVisible({ timeout: 15_000 });
  await expect(turnStatus).toContainText("your move", { timeout: 15_000 });

  // Place die in rack 0
  await page.getByTestId("rack-btn-0").click();

  // Die appears in local player section
  const localSection = page.getByTestId("player-section-local");
  await expect(localSection.getByTestId("die").first()).toBeVisible({
    timeout: 10_000,
  });

  // Wait for local score to be non-zero
  const localScore = page.getByTestId("local-player-score");
  await expect(localScore).not.toContainText("(0 points)", { timeout: 10_000 });

  // Bot should have played — die visible in opponent section
  const opponentSection = page.getByTestId("player-section-opponent");
  await expect(opponentSection.getByTestId("die").first()).toBeVisible({
    timeout: 15_000,
  });

  // Turn returns to us (or game finished)
  await expect(
    page.getByTestId("turn-status").or(page.getByTestId("game-result")),
  ).toBeVisible({ timeout: 15_000 });
});
