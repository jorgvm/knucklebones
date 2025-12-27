import { describe, it, expect } from "vitest";
import {
  isRackNumber,
  isValidFirebaseDocumentId,
  sanitizeName,
} from "./sanitise";
import { MAX_PLAYER_NAME_LENGTH } from "./constants.js";

describe("sanitizeName", () => {
  it("removes non-letter characters and spaces", () => {
    const input = "John123!@#";
    const result = sanitizeName(input);
    expect(result).toBe("John");
  });

  it("keeps letters and spaces", () => {
    const input = "John Doe";
    const result = sanitizeName(input);
    expect(result).toBe("John Doe");
  });

  it("trims name", () => {
    const input = "John     ";
    const result = sanitizeName(input);
    expect(result).toBe("John");
  });

  it("trims to max length", () => {
    const input = "ThisIsAVeryLongNameThatExceedsTwenty";
    const result = sanitizeName(input);
    expect(result).toBe("ThisIsAVeryLong");
    expect(result.length).toBe(MAX_PLAYER_NAME_LENGTH);
  });

  it("handles empty string", () => {
    const input = "";
    const result = sanitizeName(input);
    expect(result).toBe("");
  });

  it("handles special characters only", () => {
    const input = "!@a#$%b^&*c()";
    const result = sanitizeName(input);
    expect(result).toBe("abc");
  });

  it("handles mixed case and spaces", () => {
    const input = "Alice Bob 123";
    const result = sanitizeName(input);
    expect(result).toBe("Alice Bob");
  });
});

describe("isValidFirebaseDocumentId", () => {
  it("returns true for a valid Firebase document ID", () => {
    const validId = "5jLUTWk7oYnjT4YWEtXX";
    expect(isValidFirebaseDocumentId(validId)).toBe(true);
  });

  it("returns false for an ID with incorrect length", () => {
    const shortId = "abc";
    expect(isValidFirebaseDocumentId(shortId)).toBe(false);

    const longId = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    expect(isValidFirebaseDocumentId(longId)).toBe(false);
  });

  it("returns false for an ID with invalid characters", () => {
    expect(isValidFirebaseDocumentId("AAAAAAAAAAAAAAAAAAA ")).toBe(false);
    expect(isValidFirebaseDocumentId("AAAAAAAAAAAAAAAAAAA-")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isValidFirebaseDocumentId("")).toBe(false);
  });
});

describe("isRackNumber", () => {
  it("returns true for valid rack numbers", () => {
    expect(isRackNumber(0)).toBe(true);
    expect(isRackNumber(1)).toBe(true);
    expect(isRackNumber(2)).toBe(true);
  });

  it("returns false for numbers outside valid range", () => {
    expect(isRackNumber(-1)).toBe(false);
    expect(isRackNumber(3)).toBe(false);
  });

  it("returns false for non-integer numbers", () => {
    expect(isRackNumber(1.5)).toBe(false);
    expect(isRackNumber(2.7)).toBe(false);
  });

  it("returns false for invalid input", () => {
    // @ts-expect-error testing a wrong input
    expect(isRackNumber("x")).toBe(false);
    expect(isRackNumber(NaN)).toBe(false);
    // @ts-expect-error testing a wrong input
    expect(isRackNumber(undefined)).toBe(false);
    // @ts-expect-error testing a wrong input
    expect(isRackNumber(null)).toBe(false);
  });
});
