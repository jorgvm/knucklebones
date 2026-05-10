import { describe, it, expect, vi, beforeEach } from "vitest";
import { actionJoinGame } from "~/actions/join-game.js";
import { getGameFromDatabase } from "~/database/get-game.js";
import { updateGameInDatabase } from "~/database/update-game.js";
import { mockGameData } from "~/utilities/mock-game.js";

// Mock Supabase functions
vi.mock("~/database/get-game", () => ({
  getGameFromDatabase: vi.fn(),
}));

vi.mock("~/database/update-game", () => ({
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

describe("joinGame - success case", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(updateGameInDatabase).mockResolvedValue(mockGameData);
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
      gameId: "a0b1c2d3-e4f5-4678-89ab-cdef01234567",
      playerId: null,
      playerSecretId: null,
    });

    // Assert
    expect(result).toMatchObject({
      playerId: "mock-id",
      playerSecretId: "mock-id",
    });

    expect(updateGameInDatabase).toHaveBeenCalledWith(
      "a0b1c2d3-e4f5-4678-89ab-cdef01234567",
      {
        players: expect.arrayContaining([
          expect.objectContaining({
            id: "mock-id",
            name: "Alice",
            host: false,
            dice: [],
            score: 0,
          }),
        ]),
        active_player: "adc7fece-0398-42f5-a62c-549ebaa9dbbb",
        latest_actions: ["game_started"],
        status: "playing",
        secrets: expect.arrayContaining([{ id: "mock-id", secret: "mock-id" }]),
      },
    );
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
      gameId: "a0b1c2d3-e4f5-4678-89ab-cdef01234567",
      playerId: "48b54530-d2cd-4395-b264-0579d7684d84",
      playerSecretId: "2cfb8540-afc4-4a42-b129-4dfdbffc9883",
    });

    // Assert
    expect(result).toMatchObject({
      playerId: "48b54530-d2cd-4395-b264-0579d7684d84",
      playerSecretId: "2cfb8540-afc4-4a42-b129-4dfdbffc9883",
    });

    expect(updateGameInDatabase).toHaveBeenCalledWith(
      "a0b1c2d3-e4f5-4678-89ab-cdef01234567",
      {
        players: expect.arrayContaining([
          expect.objectContaining({
            id: "48b54530-d2cd-4395-b264-0579d7684d84",
            name: "Alice",
            host: false,
            dice: [],
            score: 0,
          }),
        ]),
        active_player: "adc7fece-0398-42f5-a62c-549ebaa9dbbb",
        latest_actions: ["game_started"],
        status: "playing",
        secrets: expect.arrayContaining([
          {
            id: "48b54530-d2cd-4395-b264-0579d7684d84",
            secret: "2cfb8540-afc4-4a42-b129-4dfdbffc9883",
          },
        ]),
      },
    );
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
        gameId: "a0b1c2d3-e4f5-4678-89ab-cdef01234567",
        playerId: null,
        playerSecretId: null,
      }),
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
      }),
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
        gameId: "a0b1c2d3-e4f5-4678-89ab-cdef01234567",
        playerId: "this-is-not-valid",
        playerSecretId: null,
      }),
    ).rejects.toThrow("Player id not valid");
  });
});
