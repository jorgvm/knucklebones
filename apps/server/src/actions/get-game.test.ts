import { describe, it, expect, vi, beforeEach } from "vitest";
import { actionGetGame } from "~/server-actions/get-game";
import { OPPONENT_ID } from "~/utilities/constants";
import { getGameFromDatabase } from "~/utilities/firebase";
import type { GameData } from "@shared/types";

// Mocks
vi.mock("~/utilities/firebase", () => ({
  getGameFromDatabase: vi.fn(),
}));

const player1Id = "fb8d6987-4345-46dd-b7f7-fb766259b123";
const player2Id = "fb8d6987-4345-46dd-b7f7-fb766259b1xx";

describe("actionGetGame", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns public game data when gameId and playerId are valid", async () => {
    // Arrange: mock game data
    const mockGameData: GameData = {
      id: "1",
      players: [
        { id: player1Id, name: "Alice", host: true, dice: [], score: 0 },
        { id: player2Id, name: "Bob", host: false, dice: [], score: 0 },
      ],
      active_player: player1Id,
      new_die: 4,
      winner: null,
      status: "playing",
      version: 1,
      created: "2025-01-01T00:00:00Z",
    };

    // Mocks
    vi.mocked(getGameFromDatabase).mockResolvedValue(mockGameData);

    // Act: call the function with valid gameId and playerId
    const result = await actionGetGame({
      gameId: "JO7BPzEtvwnkFQx8JWc9",
      playerId: player1Id,
    });

    // Assert: ensure the correct data is returned
    expect(result).toEqual({
      players: [
        { id: player1Id, name: "Alice", host: true, dice: [], score: 0 },
        { id: OPPONENT_ID, name: "Bob", host: false, dice: [], score: 0 }, // we're expecting opponent id to be changed
      ],
      active_player: player1Id,
      new_die: 4,
      winner: null,
      status: "playing",
      version: 1,
    });
  });

  it("throws an error when gameId is invalid", async () => {
    // Act & Assert: expect error to be thrown for invalid gameId
    await expect(
      actionGetGame({
        gameId: "invalid-game-id",
        playerId: player1Id,
      }),
    ).rejects.toThrow("Game not found");

    // Ensure the getGameFromDatabase was not called since gameId is invalid
    expect(getGameFromDatabase).not.toHaveBeenCalled();
  });
});
