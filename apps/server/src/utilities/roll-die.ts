import { randomIntBetween } from "~/utilities/random-int-between.js";

export const rollDie = (): number => {
  return randomIntBetween(1, 6);
};
