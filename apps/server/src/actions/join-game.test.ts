import { describe, it, expect, vi, beforeEach } from "vitest";
import { actionJoinGame } from "~/actions/join-game.js";
import {
  getGameFromDatabase,
  updateGameInDatabase,
} from "~/utilities/firebase.js";
import { mockGameData } from "~/utilities/mock-game.js";

// Mock Firebase functions
vi.mock("~/utilities/firebase", () => ({
  getGameFromDatabase: vi.fn(),
  updateGameInDatabase: vi.fn(),
}));

// Mock other utilities
vi.mock("~/utilities/generate-id", () => ({
  generateId: () => "mock-player-id",
}));

vi.mock("firebase/firestore", () => ({
  arrayUnion: (val: unknown) => ({ mockUnion: val }),
}));

describe("joinGame - success case", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds a new player to the game", async () => {
    // Arrange
    vi.mocked(getGameFromDatabase).mockResolvedValue({
      ...mockGameData,
      players: [],
    });

    // Act
    const result = await actionJoinGame({
      playerName: "Alice",
      gameId: "JO7BPzEtvwnkFQx8JWc9",
    });

    // Assert
    expect(result).toEqual({ playerId: "mock-player-id" });

    expect(updateGameInDatabase).toHaveBeenCalledWith("JO7BPzEtvwnkFQx8JWc9", {
      players: {
        mockUnion: expect.objectContaining({
          id: "mock-player-id",
          name: "Alice",
          host: false,
          dice: [],
          score: 0,
        }),
      },
      status: "playing",
    });
  });

  it("throws error when playerName is invalid", async () => {
    // Arrange: Make sanitizeName return an invalid/empty name
    vi.mocked(getGameFromDatabase).mockResolvedValue({
      ...mockGameData,
      players: [],
    });

    // Act & Assert
    await expect(
      actionJoinGame({
        playerName: "!@#",
        gameId: "JO7BPzEtvwnkFQx8JWc9",
      })
    ).rejects.toThrow("Invalid input.");
  });

  it("throws error when gameId is invalid", async () => {
    // Arrange: Make sanitizeName return an invalid/empty name
    vi.mocked(getGameFromDatabase).mockResolvedValue({
      ...mockGameData,
      players: [],
    });

    // Act & Assert
    await expect(
      actionJoinGame({
        playerName: "Alice",
        gameId: "xxx",
      })
    ).rejects.toThrow("Invalid input.");
  });
});
