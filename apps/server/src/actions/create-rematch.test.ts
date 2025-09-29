import { describe, it, expect, vi, beforeEach } from "vitest";

import { createGameInDatabase } from "~/utilities/firebase.js";
import { PlayerId } from "@knucklebones/shared/types.js";
import { actionCreateRematch } from "~/actions/create-rematch.js";

// Mocks
vi.mock("~/utilities/firebase", () => ({
  createGameInDatabase: vi.fn(),
}));

vi.mock("@knucklebones/shared/utilities/random-int-between.js", () => ({
  randomIntBetween: vi.fn(), // Mock this to control random player selection
}));

vi.mock("~/utilities/roll-die", () => ({
  rollDie: () => 3, // Mock rollDie to return a consistent value
}));

describe("actionCreateRematch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPlayer1 = {
    id: "player-1",
    name: "Player One",
    score: 10,
    dice: [],
    host: true,
  };
  const mockPlayer2 = {
    id: "player-2",
    name: "Player Two",
    score: 5,
    dice: [],
    host: false,
  };
  const mockSecrets = [
    { id: "player-1", secret: "secret-1" },
    { id: "player-2", secret: "secret-2" },
  ];

  it("creates a new game for a rematch with the loser going first", async () => {
    // Arrange
    vi.mocked(createGameInDatabase).mockResolvedValue("rematch-game-id");
    const previousWinner: PlayerId[] = ["player-1"]; // Player 1 won, so Player 2 should go first

    // Act
    const result = await actionCreateRematch({
      previousPlayers: [mockPlayer1, mockPlayer2],
      previousSecrets: mockSecrets,
      previousWinner,
    });

    // Assert
    expect(result).toEqual({
      gameId: "rematch-game-id",
    });

    expect(createGameInDatabase).toHaveBeenCalledWith(
      expect.objectContaining({
        active_player: "player-2", // Loser (Player 2) should be the active player
        created: expect.any(String),
        new_die: 3,
        players: [
          {
            dice: [],
            host: false, // Host status should be reset
            id: "player-1",
            name: "Player One",
            score: 0, // Score should be reset
          },
          {
            dice: [],
            host: false, // Host status should be reset
            id: "player-2",
            name: "Player Two",
            score: 0, // Score should be reset
          },
        ],
        rematch_id: null,
        secrets: mockSecrets, // Secrets should be set
        status: "playing", // Game should be in playing status
        version: 1,
        winner: [],
      })
    );
  });

  it("creates a new game for a rematch with a random player going first if it was a tie", async () => {
    // Arrange
    vi.mocked(createGameInDatabase).mockResolvedValue("rematch-game-id-tie");
    // Mock other utilities
    vi.mock("@knucklebones/shared/utilities/random-int-between.js", () => ({
      randomIntBetween: () => 1, // in this test always pick second player to go first
    }));
    const previousWinner: PlayerId[] = ["player-1", "player-2"]; // It was a tie

    // Act
    const result = await actionCreateRematch({
      previousPlayers: [mockPlayer1, mockPlayer2],
      previousSecrets: mockSecrets,
      previousWinner,
    });

    // Assert
    expect(result).toEqual({
      gameId: "rematch-game-id-tie",
    });

    expect(createGameInDatabase).toHaveBeenCalledWith(
      expect.objectContaining({
        active_player: "player-2", // Based on randomIntBetween mock
      })
    );
  });

  it("throws an error if there is a problem choosing a new active player", async () => {
    // Arrange
    const previousWinner: PlayerId[] = ["player-1"];

    // Act & Assert
    await expect(
      actionCreateRematch({
        previousPlayers: [mockPlayer1], // only pass one player, this should fail
        previousSecrets: mockSecrets,
        previousWinner,
      })
    ).rejects.toThrow("There was a problem choosing a new player");
  });

  it("throws an error if gameId is not returned from database creation", async () => {
    // Arrange
    // @ts-expect-error testing with null
    vi.mocked(createGameInDatabase).mockResolvedValue(null); // mock game not found
    const previousWinner: PlayerId[] = ["player-1"];

    // Act & Assert
    await expect(
      actionCreateRematch({
        previousPlayers: [mockPlayer1, mockPlayer2],
        previousSecrets: mockSecrets,
        previousWinner,
      })
    ).rejects.toThrow("Something went wrong during rematch creation");
  });
});
