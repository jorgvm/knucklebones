import { test, expect, type Page } from "@playwright/test";

async function waitForYourTurn(page: Page) {
  await expect(page.getByTestId("turn-status")).toHaveAttribute("data-turn", "local", {
    timeout: 15_000,
  });
}

async function placeDie(page: Page, rackIndex: 0 | 1 | 2 = 0) {
  await page.getByTestId(`rack-btn-${rackIndex}`).click();
}

test("multiplayer: p1 creates, p2 joins via url, both place dice, scores update", async ({
  browser,
}) => {
  const ctx1 = await browser.newContext();
  const ctx2 = await browser.newContext();
  const p1 = await ctx1.newPage();
  const p2 = await ctx2.newPage();

  // P1 creates multiplayer game
  await p1.goto("/");
  await p1.getByTestId("btn-multiplayer").click();
  await expect(p1).toHaveURL("/multiplayer");

  await expect(p1.getByTestId("btn-create-game")).not.toBeDisabled({
    timeout: 10_000,
  });
  await p1.getByTestId("input-player-name").fill("Player1");
  await p1.getByTestId("btn-create-game").click();

  // Wait for lobby
  await expect(p1).toHaveURL(/\/[a-zA-Z0-9-]+$/, { timeout: 15_000 });
  await expect(p1.getByTestId("share-url")).toBeVisible({ timeout: 10_000 });

  // Get game URL from share-url text (host + path)
  const shareText = await p1.getByTestId("share-url").textContent();
  const gameUrl = "http://" + shareText!.trim();

  // P2 navigates to game URL
  await p2.goto(gameUrl);

  // P2 sees join form
  await expect(p2.getByTestId("input-player-name")).toBeVisible({
    timeout: 10_000,
  });
  await p2.getByTestId("input-player-name").fill("Player2");
  await p2.getByTestId("btn-join-game").click();

  // Both players see the game board
  await expect(p1.getByTestId("turn-status")).toBeVisible({ timeout: 15_000 });
  await expect(p2.getByTestId("turn-status")).toBeVisible({ timeout: 15_000 });

  // Determine who goes first and alternate turns
  const p1TurnAttr = await p1
    .getByTestId("turn-status")
    .getAttribute("data-turn");

  const [first, second] = p1TurnAttr === "local" ? [p1, p2] : [p2, p1];

  // First player places a die
  await waitForYourTurn(first);
  await placeDie(first, 0);

  // Die visible in first player's local section
  await expect(
    first.getByTestId("player-section-local").getByTestId("die").first(),
  ).toBeVisible({ timeout: 10_000 });

  // Second player places a die
  await waitForYourTurn(second);
  await placeDie(second, 0);

  // Die visible in second player's local section
  await expect(
    second.getByTestId("player-section-local").getByTestId("die").first(),
  ).toBeVisible({ timeout: 10_000 });

  // Both scores non-zero
  await expect(first.getByTestId("local-player-score")).not.toContainText(
    "(0 points)",
    { timeout: 10_000 },
  );
  await expect(second.getByTestId("local-player-score")).not.toContainText(
    "(0 points)",
    { timeout: 10_000 },
  );

  await ctx1.close();
  await ctx2.close();
});
