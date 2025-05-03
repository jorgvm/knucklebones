import { describe, it, expect, vi, beforeEach } from "vitest";
import { actionPlaceDie } from "~/server-actions/place-die";
import { getGameFromDatabase } from "~/utilities/firebase";

import type { GameData } from "@shared/types";

// Mocks
vi.mock("~/utilities/firebase", () => ({
  getGameFromDatabase: vi.fn(),
  updateGameInDatabase: vi.fn(),
}));

vi.mock(import("~/utilities/sanitise"), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    isValidFirebaseDocumentId: vi.fn(() => true),
  };
});

describe("actionPlaceDie", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully places a die and updates the game", async () => {
    // Arrange: mock valid inputs and game data
    const mockGameData: GameData = {
      id: "1",
      players: [
        { id: "player-1", name: "Alice", host: true, dice: [], score: 0 },
        { id: "player-2", name: "Bob", host: false, dice: [], score: 0 },
      ],
      active_player: "player-1",
      new_die: 4,
      status: "playing",
      version: 1,
      created: "2025-04-30T18:49:56.973Z",
      winner: null,
    };

    vi.mocked(getGameFromDatabase).mockResolvedValue(mockGameData);

    vi.mock("~/utilities/generate-id", () => ({
      generateId: () => "mock-die-id",
      isValidCryptoId: () => true,
    }));

    vi.mock("~/utilities/roll-die", () => ({
      rollDie: () => 3,
    }));

    // Act: call the function with valid inputs
    const result = await actionPlaceDie({
      gameId: "valid-game-id",
      playerId: "player-1",
      rackNumber: 1,
    });

    // mockGameData was updated. Assert: Ensure the new die has been placed correctly in the player's rack
    const updatedPlayer = mockGameData.players[0]; // Alice is the active player

    // Check the player's rack and die properties
    const placedDie = updatedPlayer.dice.find(
      (die) => die.id === "mock-die-id",
    );

    // Check new die
    expect(placedDie).toBeDefined();
    expect(placedDie?.rack).toBe(1); // Check that the die was placed in rack 1
    expect(placedDie?.status).toBe("active"); // Die status should be "active"
    expect(placedDie?.value).toBe(4); // The value of the die should match the new die value (4)
    expect(updatedPlayer.score).toBe(4); // Player score should be updated

    // Check game state
    expect(mockGameData.status).toBe("playing");
    expect(mockGameData.active_player).toBe("player-2");
    expect(mockGameData.new_die).toBe(3);

    // Ensure the result is correct
    expect(result).toEqual({ result: "success" });
  });

  it("throws an error if its not the player's turn", async () => {
    // Arrange: mock valid inputs and game data
    const mockGameData: GameData = {
      id: "1",
      players: [
        {
          id: "player-1",
          name: "Alice",
          host: true,
          dice: [
            { id: "die-1", rack: 1, created: "", status: "active", value: 1 },
            { id: "die-2", rack: 1, created: "", status: "active", value: 1 },
            { id: "die-3", rack: 1, created: "", status: "active", value: 1 },
          ],
          score: 0,
        },
        { id: "player-2", name: "Bob", host: false, dice: [], score: 0 },
      ],
      active_player: "player-2",
      new_die: 4,
      status: "playing",
      version: 1,
      created: "",
      winner: null,
    };

    vi.mocked(getGameFromDatabase).mockResolvedValue(mockGameData);

    vi.mock("~/utilities/generate-id", () => ({
      generateId: () => "mock-die-id",
      isValidCryptoId: () => true,
    }));

    vi.mock("~/utilities/roll-die", () => ({
      rollDie: () => 3,
    }));

    // Act: call the function
    await expect(
      actionPlaceDie({
        gameId: "valid-game-id",
        playerId: "player-1", // this player can't play, test should fail
        rackNumber: 1,
      }),
    ).rejects.toThrow("Illegal move");
  });

  it("throws an error if attempting to add a fourth die to a rack", async () => {
    // Arrange: mock valid inputs and game data
    const mockGameData: GameData = {
      id: "1",
      players: [
        {
          id: "player-1",
          name: "Alice",
          host: true,
          dice: [
            { id: "die-1", rack: 1, created: "", status: "active", value: 1 },
            { id: "die-2", rack: 1, created: "", status: "active", value: 1 },
            { id: "die-3", rack: 1, created: "", status: "active", value: 1 },
          ],
          score: 0,
        },
        { id: "player-2", name: "Bob", host: false, dice: [], score: 0 },
      ],
      active_player: "player-1",
      new_die: 4,
      status: "playing",
      version: 1,
      created: "",
      winner: null,
    };

    vi.mocked(getGameFromDatabase).mockResolvedValue(mockGameData);

    vi.mock("~/utilities/generate-id", () => ({
      generateId: () => "mock-die-id",
      isValidCryptoId: () => true,
    }));

    vi.mock("~/utilities/roll-die", () => ({
      rollDie: () => 3,
    }));

    // Act: call the function
    await expect(
      actionPlaceDie({
        gameId: "valid-game-id",
        playerId: "player-1",
        rackNumber: 1, // this rack is already full, test should fail
      }),
    ).rejects.toThrow("Illegal move");
  });
});
