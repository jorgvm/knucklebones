export const randomIntBetween = (min: number, max: number): number => {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new TypeError("Both min and max must be integers");
  }

  if (min > max) {
    throw new TypeError("Max should be more than min");
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
