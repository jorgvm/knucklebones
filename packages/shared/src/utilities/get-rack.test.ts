import { describe, it, expect } from "vitest";
import { getRacks } from "~/utilities/get-racks";
import type { Die } from "@shared/types";

const mockDice: Die[] = [
  {
    id: "1",
    created: "2023-01-01T10:00:00.000Z",
    rack: 0,
    status: "active",
    value: 2,
  },
  {
    id: "2",
    created: "2023-01-01T09:00:00.000Z",
    rack: 0,
    status: "removed",
    value: 4,
  },
  {
    id: "3",
    created: "2023-01-01T08:00:00.000Z",
    rack: 1,
    status: "active",
    value: 6,
  },
  {
    id: "4",
    created: "2023-01-01T11:00:00.000Z",
    rack: 2,
    status: "active",
    value: 1,
  },
];

describe("getRacks", () => {
  it("distributes dice into the correct racks without filtering", () => {
    const [rack0, rack1, rack2] = getRacks(mockDice);

    expect(rack0).toHaveLength(2);
    expect(rack1).toHaveLength(1);
    expect(rack2).toHaveLength(1);
  });

  it("sorts dice in each rack by created date ascending", () => {
    const [rack0] = getRacks(mockDice);
    expect(rack0[0].id).toBe("2"); // 09:00
    expect(rack0[1].id).toBe("1"); // 10:00
  });

  it("filters out non-active dice when filtered = true", () => {
    const [rack0, rack1, rack2] = getRacks(mockDice, true);

    expect(rack0).toHaveLength(1);
    expect(rack0[0].status).toBe("active");
    expect(rack1).toHaveLength(1);
    expect(rack2).toHaveLength(1);
  });

  it("returns empty racks when no dice are passed", () => {
    const [rack0, rack1, rack2] = getRacks([]);
    expect(rack0).toEqual([]);
    expect(rack1).toEqual([]);
    expect(rack2).toEqual([]);
  });
});
