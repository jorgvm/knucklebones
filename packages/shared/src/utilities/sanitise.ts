import { MAX_PLAYER_NAME_LENGTH } from "./constants.js";

/**
 * Sanitizes a name string by:
 * - Removing all characters except letters (A–Z, a–z) and spaces
 * - Truncating the result to a maximum of certain characters
 */
export const sanitizeName = (input: string): string => {
  // Remove anything that's not a letter or space
  const sanitized = input.replace(/[^a-zA-Z ]/g, "");

  // Trim to max 20 characters
  return sanitized.slice(0, MAX_PLAYER_NAME_LENGTH).trim();
};

/**
 * Check if value is valid rack number: 1 2 or 3
 */
export const isRackNumber = (value: number): boolean =>
  [0, 1, 2].includes(value);
