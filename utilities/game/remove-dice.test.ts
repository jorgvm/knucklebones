import { describe, it, expect } from "vitest";
import { removeDice } from "~/utilities/game/remove-dice";
import type { Die } from "~/utilities/types";

describe("removeDice", () => {
  it("sets status to 'removed' for dice that match rack and value", () => {
    const input: Die[] = [
      {
        id: "d1",
        value: 3,
        rack: 1,
        status: "active",
        created: "2025-01-01T00:00:00Z",
      },
      {
        id: "d2",
        value: 3,
        rack: 2,
        status: "active",
        created: "2025-01-01T00:00:00Z",
      },
      {
        id: "d3",
        value: 4,
        rack: 1,
        status: "active",
        created: "2025-01-01T00:00:00Z",
      },
    ];

    const result = removeDice({
      dice: input,
      rackNumber: 1,
      dieValue: 3,
    });

    expect(result.find((d) => d.id === "d1")?.status).toBe("removed");
    expect(result.find((d) => d.id === "d2")?.status).toBe("active");
    expect(result.find((d) => d.id === "d3")?.status).toBe("active");
  });

  it("returns unchanged dice if no match found", () => {
    const input: Die[] = [
      {
        id: "d1",
        value: 2,
        rack: 0,
        status: "active",
        created: "2025-01-01T00:00:00Z",
      },
    ];

    const result = removeDice({
      dice: input,
      rackNumber: 2,
      dieValue: 5,
    });

    expect(result).toEqual(input);
  });

  it("handles empty dice list", () => {
    const result = removeDice({
      dice: [],
      rackNumber: 0,
      dieValue: 6,
    });

    expect(result).toEqual([]);
  });
});
