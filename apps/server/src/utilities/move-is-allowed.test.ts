import { describe, it, expect } from "vitest";
import { mockGameData } from "~/utilities/mock-game.js";
import { moveIsAllowed } from "~/utilities/move-is-allowed.js";

describe("moveIsAllowed", () => {
  const jane = mockGameData.players[1]; // "jane", the active player
  const john = mockGameData.players[0];

  it("returns true if it's the active player's turn, game is playing, and rack is not full", () => {
    const result = moveIsAllowed({
      activePlayer: jane,
      playerSecretId: "abc",
      secrets: [{ id: jane.id, secret: "abc" }],
      gameActivePlayerId: mockGameData.active_player,
      gameStatus: mockGameData.status,
      rackNumber: 0, // Jane has 2 dice in rack 0
    });
    expect(result).toBe(true);
  });

  it("returns false if it's not the player's turn", () => {
    const result = moveIsAllowed({
      activePlayer: john,
      playerSecretId: "abc",
      secrets: [{ id: jane.id, secret: "abc" }],
      gameActivePlayerId: mockGameData.active_player,
      gameStatus: mockGameData.status,
      rackNumber: 0,
    });
    expect(result).toBe(false);
  });

  it("returns false if the game is not in 'playing' status", () => {
    const result = moveIsAllowed({
      activePlayer: jane,
      playerSecretId: "abc",
      secrets: [{ id: jane.id, secret: "abc" }],
      gameActivePlayerId: mockGameData.active_player,
      gameStatus: "lobby", // invalid game status
      rackNumber: 0,
    });
    expect(result).toBe(false);
  });

  it("returns false if activePlayer is null", () => {
    const result = moveIsAllowed({
      // @ts-expect-error mock missing activePlayer
      activePlayer: null,
      playerSecretId: "abc",
      secrets: [{ id: jane.id, secret: "abc" }],
      gameActivePlayerId: mockGameData.active_player,
      gameStatus: mockGameData.status,
      rackNumber: 0,
    });
    expect(result).toBe(false);
  });

  it("returns false if the chosen rack is full (3 active dice)", () => {
    const result = moveIsAllowed({
      activePlayer: jane,
      playerSecretId: "abc",
      secrets: [{ id: jane.id, secret: "abc" }],
      gameActivePlayerId: mockGameData.active_player,
      gameStatus: mockGameData.status,
      rackNumber: 2, // Jane has 3 active dice in rack 2
    });
    expect(result).toBe(false);
  });
});
