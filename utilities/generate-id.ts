/**
 * Generates a unique identifier string using the built-in crypto method
 *
 * Will generate for example "fb8d6987-4345-46dd-b7f7-fb766259b123"
 */
export const generateId = (): string => crypto.randomUUID();

/**
 * Checks if a string is a valid slug.
 *
 * - Is exactly 36 characters long
 * - Contains only lowercase letters, numbers, and dashes (`-`)
 */
export const isValidCryptoId = (value: string): boolean => {
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(value);
};
