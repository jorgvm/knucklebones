import { describe, it, expect } from "vitest";
import { randomIntBetween } from "./random-int-between.js";

describe("randomIntBetween", () => {
  it("returns a number within the range", () => {
    for (let i = 0; i < 100; i++) {
      const result = randomIntBetween(1, 15);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(15);
    }
  });

  it("works when min and max are equal", () => {
    expect(randomIntBetween(3, 3)).toBe(3);
  });

  it("handles negative numbers", () => {
    for (let i = 0; i < 100; i++) {
      const result = randomIntBetween(-10, -5);
      expect(result).toBeGreaterThanOrEqual(-10);
      expect(result).toBeLessThanOrEqual(-5);
    }
  });

  it("handles min greater than max by swapping", () => {
    const [min, max] = [10, 5];
    const result = randomIntBetween(Math.min(min, max), Math.max(min, max));
    expect(result).toBeGreaterThanOrEqual(5);
    expect(result).toBeLessThanOrEqual(10);
  });

  it("distributes values roughly evenly over many samples", () => {
    const min = 1;
    const max = 5;
    const iterations = 10000;
    const counts: Record<number, number> = {};

    // Initialize count map
    for (let i = min; i <= max; i++) {
      counts[i] = 0;
    }

    for (let i = 0; i < iterations; i++) {
      const val = randomIntBetween(min, max);
      counts[val]++;
    }

    const expected = iterations / (max - min + 1);
    const tolerance = expected * 0.1; // Allow ±10%

    for (let i = min; i <= max; i++) {
      expect(counts[i]).toBeGreaterThanOrEqual(expected - tolerance);
      expect(counts[i]).toBeLessThanOrEqual(expected + tolerance);
    }
  });

  it("throws an error if min or max is not an integer", () => {
    expect(() => randomIntBetween(1.2, 5)).toThrow(TypeError);
    expect(() => randomIntBetween(1, 5.1)).toThrow(TypeError);
    expect(() => randomIntBetween(1.5, 5.1)).toThrow(TypeError);
    // @ts-expect-error test
    expect(() => randomIntBetween(null, 1)).toThrow(TypeError);
    // @ts-expect-error test
    expect(() => randomIntBetween("", 1)).toThrow(TypeError);
    // @ts-expect-error test
    expect(() => randomIntBetween(undefined, 1)).toThrow(TypeError);
  });

  it("throws an error if max is more than min", () => {
    expect(() => randomIntBetween(10, 1)).toThrow(TypeError);
  });
});
