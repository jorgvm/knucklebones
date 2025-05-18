import { describe, it, expect, vi, beforeEach } from "vitest";
import { actionCreateGame } from "./create-game.js";
import { createGameInDatabase } from "~/utilities/firebase.js";

// Mocks
vi.mock("~/utilities/firebase", () => ({
  createGameInDatabase: vi.fn(),
}));

vi.mock("~/utilities/generate-id", () => ({
  generateId: () => "mock-id",
}));

vi.mock("~/utilities/roll-die", () => ({
  rollDie: () => 3,
}));

describe("actionCreateGame - success case", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new game and returns data", async () => {
    // Arrange
    vi.mocked(createGameInDatabase).mockResolvedValue("mock-game-id");

    // Act
    const result = await actionCreateGame({
      playerName: " Alice Doe ",
    });

    // Assert
    expect(result).toEqual({
      playerId: "mock-id",
      playerSecretId: "mock-id",
      gameId: "mock-game-id",
    });

    expect(createGameInDatabase).toHaveBeenCalledWith(
      expect.objectContaining({
        version: 1,
        players: [
          expect.objectContaining({
            id: "mock-id",
            name: "Alice Doe",
            host: true,
            dice: [],
            score: 0,
          }),
        ],
        active_player: "",
        new_die: 3,
        status: "lobby",
        winner: [],
      })
    );
  });

  it("throws error when playerName is invalid", async () => {
    // Act & Assert
    await expect(actionCreateGame({ playerName: "!@#" })).rejects.toThrow(
      "No valid name was supplied"
    );
  });
});
