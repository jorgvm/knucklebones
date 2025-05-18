import { Player } from "@knucklebones/shared/types.js";
import { describe, it, expect } from "vitest";
import { getWinner } from "~/utilities/get-winner.js";

describe("getWinner", () => {
  const player1: Player = {
    dice: [],
    host: true,
    id: "player1",
    name: "Alice",
    score: 25,
  };

  const player2: Player = {
    dice: [],
    host: false,
    id: "player2",
    name: "Bob",
    score: 30,
  };

  const player3: Player = {
    dice: [],
    host: false,
    id: "player3",
    name: "Charlie",
    score: 30,
  };

  it("should return the id of the player with the highest score", () => {
    const players = [player1, player2];
    expect(getWinner(players)).toEqual(["player2"]);
  });

  it("should return both players if they score the same", () => {
    const players = [player2, player3];
    const winner = getWinner(players);
    expect(winner).toBeDefined();
    expect(winner).toEqual(["player2", "player3"]);
  });
});
