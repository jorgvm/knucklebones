import type { Die, Racks } from "@shared/types";

/**
 * Group the dice into three racks, based on the unorderd list of dice
 *
 */
export const getRacks = (dice: Die[], filtered = false): Racks => {
  const racks: Racks = [[], [], []];

  dice.forEach((die) => {
    // if filtered, only return active dice
    if (!filtered || (filtered && die.status === "active")) {
      racks[die.rack].push(die);
    }
  });

  // Sort each rack by created date, oldest to newest
  racks.forEach((rack) => {
    rack.sort((a, b) => a.created.localeCompare(b.created));
  });

  return racks;
};
