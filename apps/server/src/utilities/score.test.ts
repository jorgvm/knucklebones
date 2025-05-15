import { Die, Player } from "@knucklebones/shared/types.js";
import { describe, it, expect } from "vitest";
import { getRackScore, getPlayerScore } from "~/utilities/score.js";

describe("getRackScore", () => {
  it("calculates score", () => {
    const rack: Die[] = [
      { id: "1", created: "", rack: 0, status: "active", value: 2 },
      { id: "2", created: "", rack: 0, status: "active", value: 3 },
    ];

    // 2*1 + 3*1 = 5
    expect(getRackScore(rack)).toBe(5);
  });

  it("calculates score and ignores removed dice", () => {
    const rack: Die[] = [
      { id: "1", created: "", rack: 0, status: "active", value: 2 },
      { id: "2", created: "", rack: 0, status: "active", value: 2 },
      { id: "3", created: "", rack: 0, status: "removed", value: 2 },
    ];

    // 2*2 + 2*2 + ignored = 8
    expect(getRackScore(rack)).toBe(8);
  });

  it("calculates score with repeated values", () => {
    const rack: Die[] = [
      { id: "1", created: "", rack: 0, status: "active", value: 3 },
      { id: "2", created: "", rack: 0, status: "active", value: 3 },
      { id: "3", created: "", rack: 0, status: "active", value: 4 },
    ];

    // 3*2 + 3*2 + 4*1 = 16
    expect(getRackScore(rack)).toBe(16);
  });

  it("returns 0 for an empty rack", () => {
    const rack: Die[] = [];
    expect(getRackScore(rack)).toBe(0);
  });
});

describe("getPlayerScore", () => {
  it("sums the correct score across all racks with active dice", () => {
    const player: Player = {
      id: "p1",
      name: "Test Player",
      host: true,
      score: 0,
      dice: [
        { id: "a", created: "", rack: 0, status: "active", value: 2 },
        { id: "b", created: "", rack: 0, status: "active", value: 2 },

        { id: "c", created: "", rack: 1, status: "active", value: 4 },

        { id: "d", created: "", rack: 2, status: "active", value: 1 },
        { id: "e", created: "", rack: 2, status: "removed", value: 1 },
      ],
    };

    // 2*2 + 2*2 = 8
    // 4*1 = 4
    // 1*1 + (removed) = 1
    // = 13
    expect(getPlayerScore(player)).toBe(13);
  });

  it("returns 0 when all dice are removed", () => {
    const player: Player = {
      id: "p2",
      name: "Empty Player",
      host: false,
      score: 0,
      dice: [
        { id: "x", created: "", rack: 0, status: "removed", value: 3 },
        { id: "y", created: "", rack: 1, status: "removed", value: 5 },
      ],
    };

    expect(getPlayerScore(player)).toBe(0);
  });
});
