import { describe, it, expect } from "vitest";
import { isGameReady } from "~/utilities/is-game-ready";
import { mockGameData } from "~/utilities/mock-game";

describe("isGameReady", () => {
  it("returns true if a player has 3 active dice in all 3 racks", () => {
    expect(isGameReady(mockGameData)).toBe(true);
  });

  it("returns false if no player has 3 active dice in all 3 racks", () => {
    const notReadyGame = structuredClone(mockGameData);

    // Remove dice from first player to break the full rack requirement
    notReadyGame.players[0].dice = [];

    expect(isGameReady(notReadyGame)).toBe(false);
  });
});
