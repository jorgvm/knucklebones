import type { Die } from "@shared/types";

/**
 * Update dice in a specific rack to 'removed' status.
 *
 * When a die is placed, dice in the opponent's same rack, with the same value, are removed.
 */
export const removeDice = ({
  dice,
  rackNumber,
  dieValue,
}: {
  dice: Die[];
  rackNumber: number;
  dieValue: number;
}): Die[] => {
  return dice.map((die) => {
    if (die.rack === rackNumber && die.value === dieValue) {
      return { ...die, status: "removed" };
    }
    return die;
  });
};
