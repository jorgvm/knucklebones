import type { Dice, Racks } from "~/utilities/types";

/**
 * Group the dice into three racks, based on the unorderd list of dice
 *
 */
export const getRacks = (diceList: Dice[], filtered = false): Racks => {
  const racks: Racks = [[], [], []];

  diceList.forEach((dice) => {
    // if filtered, only return active dice
    if (!filtered || (filtered && dice.status === "active")) {
      racks[dice.rack].push(dice);
    }
  });

  // Sort each rack by created date, oldest to newest
  racks.forEach((rack) => {
    rack.sort((a, b) => a.created.localeCompare(b.created));
  });

  return racks;
};
