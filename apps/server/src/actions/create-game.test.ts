import { describe, it, expect, vi, beforeEach } from "vitest";
import { actionCreateGame } from "./create-game.js";
import { createGameInDatabase } from "~/utilities/firebase.js";

// Mocks
vi.mock("~/utilities/firebase", () => ({
  createGameInDatabase: vi.fn(),
}));

vi.mock(import("~/utilities/generate-id.js"), async (importOriginal) => ({
  ...(await importOriginal()),
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
      playerId: null,
      playerSecretId: null,
      type: "multiplayer",
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

  it("creates a new game with pre-filled ids", async () => {
    // Arrange
    vi.mocked(createGameInDatabase).mockResolvedValue("mock-game-id");

    // Act
    const result = await actionCreateGame({
      playerName: " Alice Doe ",
      playerId: "002368b8-92ab-4f26-858b-135172487934",
      playerSecretId: "15c6cb3e-31bc-4f8f-83ce-ca6b36e03897",
      type: "multiplayer",
    });

    // Assert
    expect(result).toEqual({
      playerId: "002368b8-92ab-4f26-858b-135172487934",
      playerSecretId: "15c6cb3e-31bc-4f8f-83ce-ca6b36e03897",
      gameId: "mock-game-id",
    });

    expect(createGameInDatabase).toHaveBeenCalledWith(
      expect.objectContaining({
        version: 1,
        players: [
          expect.objectContaining({
            id: "002368b8-92ab-4f26-858b-135172487934",
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
        secrets: [
          {
            id: "002368b8-92ab-4f26-858b-135172487934",
            secret: "15c6cb3e-31bc-4f8f-83ce-ca6b36e03897",
          },
        ],
      })
    );
  });

  it("throws error when playerName is invalid", async () => {
    // Act & Assert
    await expect(
      actionCreateGame({
        playerName: "!@#",
        playerId: null,
        playerSecretId: null,
        type: "multiplayer",
      })
    ).rejects.toThrow("No valid name was supplied");
  });
});
