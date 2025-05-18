import { describe, it, expect } from "vitest";
import { serverError } from "~/utilities/server-error.js";

describe("serverError", () => {
  it("should return a generic error message for unknown errors", () => {
    const result = serverError(null);
    expect(result).toEqual({
      status: "error",
      message: "An unknown error occurred",
    });
  });

  it("should return the error message if the input is an Error object with a message", () => {
    const error = new Error("Something went wrong!");
    const result = serverError(error);
    expect(result).toEqual({
      status: "error",
      message: "Something went wrong!",
    });
  });

  it("should handle Error objects without a message property", () => {
    const error = new Error();
    const result = serverError(error);
    expect(result).toEqual({
      status: "error",
      message: "An unknown error occurred",
    });
  });

  it("should handle non-Error objects by returning the generic message", () => {
    const result = serverError("string error");
    expect(result).toEqual({
      status: "error",
      message: "An unknown error occurred",
    });

    const result2 = serverError({ some: "object" });
    expect(result2).toEqual({
      status: "error",
      message: "An unknown error occurred",
    });
  });
});
