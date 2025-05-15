import { describe, it, expect } from "vitest";
import { rollDie } from "~/utilities/roll-die.js";

describe("rollDie", () => {
  it("should return a number between 1 and 6 (inclusive) over 100 rolls", () => {
    for (let i = 0; i < 100; i++) {
      const result = rollDie();
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(6);
    }
  });
});
