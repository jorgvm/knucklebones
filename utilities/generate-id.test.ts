import { describe, it, expect } from "vitest";
import { generateId, isValidCryptoId } from "~/utilities/generate-id";

describe("generateId", () => {
  it("returns different values on subsequent calls", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it("returns success with validation utility", () => {
    const id = generateId();
    expect(isValidCryptoId(id)).toBe(true);
  });
});

describe("isValidCryptoId", () => {
  it("returns true for a valid crypto ID", () => {
    const validId = "7ed8fd93-f3e8-4697-ad38-bc8c231bb376";
    expect(isValidCryptoId(validId)).toBe(true);
  });

  it("returns false for an ID with incorrect length", () => {
    const shortId = "abc123-def456-ghi789-jkl012";
    expect(isValidCryptoId(shortId)).toBe(false);
  });

  it("returns false for an ID with invalid characters", () => {
    const invalidId = "abc123-def456-ghi789-jkl012-mno34#";
    expect(isValidCryptoId(invalidId)).toBe(false);
  });

  it("returns false for an ID with uppercase letters", () => {
    const uppercaseId = "ABC123-def456-ghi789-jkl012-mno345";
    expect(isValidCryptoId(uppercaseId)).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isValidCryptoId("")).toBe(false);
  });
});
