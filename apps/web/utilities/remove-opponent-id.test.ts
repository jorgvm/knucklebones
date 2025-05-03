import { describe, it, expect } from "vitest";
import { OPPONENT_ID } from "~/utilities/constants";
import {
  removeOpponentId,
  replaceValueInObject,
} from "~/utilities/remove-opponent-id";
import type { GameData } from "~/utilities/types";

describe("replaceValueInObject", () => {
  it("replaces a primitive value in a flat object", () => {
    const input = { a: "foo", b: "bar" };
    const result = replaceValueInObject(input, "foo", "baz");
    expect(result).toEqual({ a: "baz", b: "bar" });
  });

  it("replaces values in a nested object", () => {
    const input = { a: "foo", b: { c: "foo", d: "bar" } };
    const result = replaceValueInObject(input, "foo", "baz");
    expect(result).toEqual({ a: "baz", b: { c: "baz", d: "bar" } });
  });

  it("replaces values in arrays", () => {
    const input = ["foo", "bar", { a: "foo" }];
    const result = replaceValueInObject(input, "foo", "baz");
    expect(result).toEqual(["baz", "bar", { a: "baz" }]);
  });

  it("returns the same object when no value matches", () => {
    const input = { a: "bar" };
    const result = replaceValueInObject(input, "foo", "baz");
    expect(result).toEqual({ a: "bar" });
  });

  it("handles null and undefined values safely", () => {
    const input = { a: null, b: undefined, c: "foo" };
    const result = replaceValueInObject(input, "foo", "baz");
    expect(result).toEqual({ a: null, b: undefined, c: "baz" });
  });

  it("replaces root-level primitives (non-objects)", () => {
    const input = "foo";
    const result = replaceValueInObject(input, "foo", "baz");
    expect(result).toBe("baz");
  });
});

const mockGameData: GameData = {
  id: "x",
  version: 1,
  new_die: 3,
  status: "lobby",
  active_player: "bbb",
  winner: "aaa",
  created: "2025-04-30T18:49:56.973Z",
  players: [
    {
      id: "aaa",
      name: "player-1-name",
      host: true,
      score: 0,
      dice: [],
    },
    {
      id: "bbb",
      name: "player-2-name",
      host: false,
      score: 0,
      dice: [],
    },
  ],
};

describe("removeOpponentId with example data", () => {
  it("replaces the opponent ID wherever it appears in game data", () => {
    const opponentId = "bbb";
    const result = removeOpponentId(mockGameData, opponentId);

    expect(result.players[1].id).toBe(OPPONENT_ID);
    expect(result.players[0].id).not.toBe(OPPONENT_ID);
    expect(result.active_player).toBe(OPPONENT_ID); // not replaced
  });

  it("does nothing if no opponentId is passed", () => {
    const result = removeOpponentId(mockGameData);
    expect(result).toBe(mockGameData);
  });
});
