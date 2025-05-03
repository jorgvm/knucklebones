import { MAX_PLAYER_NAME_LENGTH } from "./constants";

/**
 * Sanitizes a name string by:
 * - Removing all characters except letters (A–Z, a–z) and spaces
 * - Truncating the result to a maximum of 20 characters
 */
export const sanitizeName = (input: string): string => {
  // Remove anything that's not a letter or space
  const sanitized = input.replace(/[^a-zA-Z ]/g, "");

  // Trim to max 20 characters
  return sanitized.slice(0, MAX_PLAYER_NAME_LENGTH).trim();
};

/**
 * Checks if a string:
 * - Is exactly 20 characters long
 * - Contains only uppercase letters, lowercase letters, and number
 *
 * For example: JO7BPzEtvwnkFQx8JWc9
 */
export const isValidFirebaseDocumentId = (value: string): boolean => {
  const pattern = /^[a-zA-Z0-9]{20}$/;
  return pattern.test(value);
};

/**
 * Check if value is valid rack number, 1 2 or 3
 */
export const isRackNumber = (value: number): boolean =>
  [0, 1, 2].includes(value);
