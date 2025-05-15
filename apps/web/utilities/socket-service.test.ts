import { sanitizeName } from "@shared/utilities/sanitise";
import { describe, it, expect } from "vitest";

// todo
describe("todo", () => {
  it("todo", () => {
    expect(sanitizeName(" test ")).toBe("test");
  });
});
