import { Die, GameData } from "@knucklebones/shared/types.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { actionPlaceDie } from "~/actions/place-die.js";
import { getGameFromDatabase } from "~/utilities/firebase.js";
import { createGameInDatabase } from "~/utilities/firebase.js";

// Mock gamedata
const mockGameDataSetup: GameData = {
  players: [
    {
      id: "player-1",
      name: "Alice",
      host: true,
      dice: [
        { id: "die-1", rack: 0, created: "", status: "active", value: 1 },
        { id: "die-2", rack: 1, created: "", status: "active", value: 1 },
        { id: "die-3", rack: 2, created: "", status: "active", value: 1 },
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
  winner: [],
  secrets: [
    {
      id: "player-1",
      secret: "9f950028-fe29-4732-bfde-71ef9cca3085",
    },
    {
      id: "player-2",
      secret: "12350028-fe29-4732-bfde-71ef9cca3123",
    },
  ],
  rematch_id: null,
  latest_actions: [],
};

const allDiceMinusOne: Die[] = [
  { id: "die-1", rack: 0, created: "", status: "active", value: 1 },
  { id: "die-2", rack: 0, created: "", status: "active", value: 1 },
  { id: "die-3", rack: 0, created: "", status: "active", value: 1 },
  { id: "die-4", rack: 1, created: "", status: "active", value: 1 },
  { id: "die-5", rack: 1, created: "", status: "active", value: 1 },
  { id: "die-6", rack: 1, created: "", status: "active", value: 1 },
  { id: "die-7", rack: 2, created: "", status: "active", value: 1 },
  { id: "die-8", rack: 2, created: "", status: "active", value: 1 },
  // make sure rack 2 is mising one die
];

// Mocks
vi.mock("~/utilities/firebase", () => ({
  getGameFromDatabase: vi.fn(),
  updateGameInDatabase: vi.fn(),
  createGameInDatabase: vi.fn(),
}));

vi.mock(
  import("@knucklebones/shared/utilities/sanitise.js"),
  async (importOriginal) => {
    const actual = await importOriginal();

    return {
      ...actual,
      isValidFirebaseDocumentId: vi.fn(() => true),
    };
  }
);

describe("actionPlaceDie", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully places a die and updates the game", async () => {
    // Arrange: mock valid inputs and game data
    const mockGameData = structuredClone(mockGameDataSetup);

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
      playerId: "player-2",
      playerSecretId: "12350028-fe29-4732-bfde-71ef9cca3123",
      rackNumber: 1,
    });

    // mockGameData was updated. Assert: Ensure the new die has been placed correctly in the player's rack
    const updatedPlayer = mockGameData.players[1];

    // Check the player's rack and die properties
    const placedDie = updatedPlayer.dice.find(
      (die) => die.id === "mock-die-id"
    );

    // Check new die
    expect(placedDie).toBeDefined();
    expect(placedDie?.rack).toBe(1); // Check that the die was placed in rack 1
    expect(placedDie?.status).toBe("active"); // Die status should be "active"
    expect(placedDie?.value).toBe(4); // The value of the die should match the new die value (4)
    expect(updatedPlayer.score).toBe(4); // Player score should be updated

    // Check game state
    expect(mockGameData.status).toBe("playing");
    expect(mockGameData.active_player).toBe("player-1");
    expect(mockGameData.new_die).toBe(3);

    // Ensure the result is correct
    expect(result).toEqual({ result: "success" });
  });

  it("throws an error if its not the player's turn", async () => {
    // Arrange: mock valid inputs and game data
    const mockGameData = structuredClone(mockGameDataSetup);

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
        playerSecretId: "9f950028-fe29-4732-bfde-71ef9cca3085",
        rackNumber: 1,
      })
    ).rejects.toThrow("It's not the players turn");
  });

  it("throws an error if attempting to add a fourth die to a rack", async () => {
    // Arrange: mock valid inputs and game data
    const mockGameData = structuredClone(mockGameDataSetup);

    mockGameData.players[1].dice = [
      { id: "die-1", rack: 1, created: "", status: "active", value: 1 },
      { id: "die-2", rack: 1, created: "", status: "active", value: 1 },
      { id: "die-3", rack: 1, created: "", status: "active", value: 1 },
    ];

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
        playerId: "player-2",
        playerSecretId: "12350028-fe29-4732-bfde-71ef9cca3123",
        rackNumber: 1, // this rack is already full, test should fail
      })
    ).rejects.toThrow("Rack is already full");
  });

  it("throws an error when secret is not correct", async () => {
    // Arrange: mock valid inputs and game data
    const mockGameData: GameData = {
      players: [
        { id: "player-1", name: "Alice", host: true, dice: [], score: 0 },
        { id: "player-2", name: "Bob", host: false, dice: [], score: 0 },
      ],
      active_player: "player-1",
      new_die: 4,
      status: "playing",
      version: 1,
      created: "2025-04-30T18:49:56.973Z",
      winner: [],
      secrets: [
        {
          id: "player-1",
          secret: "9f950028-fe29-4732-bfde-71ef9cca3085",
        },
      ],
      rematch_id: null,
      latest_actions: [],
    };

    vi.mocked(getGameFromDatabase).mockResolvedValue(mockGameData);

    // Act: call the function with valid inputs
    await expect(
      actionPlaceDie({
        gameId: "valid-game-id",
        playerId: "player-1",
        playerSecretId: "9f950028-fe29-4732-bfde-71ef9ccafake",
        rackNumber: 1,
      })
    ).rejects.toThrow("Secret is not correct");
  });

  //
  it("updates game with rematch_id when the last die is placed", async () => {
    // Arrange: mock game data where only one placement remains
    const mockGameData = structuredClone(mockGameDataSetup);

    vi.mocked(getGameFromDatabase).mockResolvedValue(mockGameData);
    vi.mocked(createGameInDatabase).mockResolvedValue("mock-rematch-id");

    mockGameData.players[1].dice = allDiceMinusOne;

    // Act: call the function to place the last die
    await actionPlaceDie({
      gameId: "valid-game-id",
      playerId: "player-2",
      playerSecretId: "12350028-fe29-4732-bfde-71ef9cca3123",
      rackNumber: 2,
    });

    // Assert: Ensure updateGameInDatabase was called with a game state containing a rematch_id
    expect(mockGameData.status).toBe("finished");
    expect(mockGameData.rematch_id).toBe("mock-rematch-id");
  });
});
