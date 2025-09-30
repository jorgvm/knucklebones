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

vi.mock(import("~/utilities/generate-id.js"), async (importOriginal) => ({
  ...(await importOriginal()),
  generateId: () => "mock-id",
}));

// Mock other utilities
vi.mock("@knucklebones/shared/utilities/random-int-between.js", () => ({
  randomIntBetween: () => 0, // always pick first player to go first
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
      players: [mockGameData.players[0]],
    });

    // Act
    const result = await actionJoinGame({
      playerName: "Alice",
      gameId: "JO7BPzEtvwnkFQx8JWc9",
      playerId: null,
      playerSecretId: null,
    });

    // Assert
    expect(result).toEqual({ playerId: "mock-id", playerSecretId: "mock-id" });

    expect(updateGameInDatabase).toHaveBeenCalledWith("JO7BPzEtvwnkFQx8JWc9", {
      players: {
        mockUnion: expect.objectContaining({
          id: "mock-id",
          name: "Alice",
          host: false,
          dice: [],
          score: 0,
        }),
      },
      active_player: "adc7fece-0398-42f5-a62c-549ebaa9dbbb",
      latest_actions: ["game_started"],
      status: "playing",
      secrets: {
        mockUnion: {
          id: "mock-id",
          secret: "mock-id",
        },
      },
    });
  });

  it("adds a new player when prefilling ids", async () => {
    // Arrange
    vi.mocked(getGameFromDatabase).mockResolvedValue({
      ...mockGameData,
      players: [mockGameData.players[0]],
    });

    // Act
    const result = await actionJoinGame({
      playerName: "Alice",
      gameId: "JO7BPzEtvwnkFQx8JWc9",
      playerId: "48b54530-d2cd-4395-b264-0579d7684d84",
      playerSecretId: "2cfb8540-afc4-4a42-b129-4dfdbffc9883",
    });

    // Assert
    expect(result).toEqual({
      playerId: "48b54530-d2cd-4395-b264-0579d7684d84",
      playerSecretId: "2cfb8540-afc4-4a42-b129-4dfdbffc9883",
    });

    expect(updateGameInDatabase).toHaveBeenCalledWith("JO7BPzEtvwnkFQx8JWc9", {
      players: {
        mockUnion: expect.objectContaining({
          id: "48b54530-d2cd-4395-b264-0579d7684d84",
          name: "Alice",
          host: false,
          dice: [],
          score: 0,
        }),
      },
      active_player: "adc7fece-0398-42f5-a62c-549ebaa9dbbb",
      latest_actions: ["game_started"],
      status: "playing",
      secrets: {
        mockUnion: {
          id: "48b54530-d2cd-4395-b264-0579d7684d84",
          secret: "2cfb8540-afc4-4a42-b129-4dfdbffc9883",
        },
      },
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
        playerId: null,
        playerSecretId: null,
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
        gameId: "this-id-is-not-valid",
        playerId: null,
        playerSecretId: null,
      })
    ).rejects.toThrow("Invalid input.");
  });

  it("throws error when player id is invalid", async () => {
    // Arrange: Make sanitizeName return an invalid/empty name
    vi.mocked(getGameFromDatabase).mockResolvedValue({
      ...mockGameData,
      players: [],
    });

    // Act & Assert
    await expect(
      actionJoinGame({
        playerName: "Alice",
        gameId: "JO7BPzEtvwnkFQx8JWc9",
        playerId: "this-is-not-valid",
        playerSecretId: null,
      })
    ).rejects.toThrow("Player id not valid");
  });
});
