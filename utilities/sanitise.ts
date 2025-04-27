import { MAX_PLAYER_NAME_LENGTH } from "~/utilities/constants";

/**
 * Sanitizes a name string by:
 * - Removing all characters except letters (A–Z, a–z) and spaces
 * - Truncating the result to a maximum of 20 characters
 */
export const sanitizeName = (input: string): string => {
  // Remove anything that's not a letter or space
  const sanitized = input.replace(/[^a-zA-Z ]/g, "");

  // Trim to max 20 characters
  return sanitized.slice(0, MAX_PLAYER_NAME_LENGTH);
};

/**
 * Checks if a string is a valid slug.
 *
 * - Is exactly 36 characters long
 * - Contains only lowercase letters, numbers, and dashes (`-`)
 */
export const isValidCryptoId = (value: string): boolean => {
  const pattern = /^[a-z0-9-]{36}$/;
  return pattern.test(value);
};

/**
 * Checks if a string:
 * - Is exactly 20 characters long
 * - Contains only uppercase letters, lowercase letters, and number
 */
export const isValidFirebaseDocumentId = (value: string): boolean => {
  const pattern = /^[a-zA-Z0-9]{20}$/;
  return pattern.test(value);
};

/**
 * Check if value is number
 */
export const isNumber = (value: unknown): boolean => typeof value === "number";
