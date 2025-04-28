import type { Die } from "~/utilities/types";

/**
 * Update dice in a specific rack to 'removed' status.
 *
 * When a die is placed, dice in the opponent's same rack, with the same value, are removed.
 */
export const removeDice = ({
  dice,
  rackNumber,
  dieValue: diceValue,
}: {
  dice: Die[];
  rackNumber: number;
  dieValue: number;
}): Die[] => {
  return dice.map((die) => {
    if (die.rack === rackNumber && die.value === diceValue) {
      die.status = "removed";
    }
    return die;
  });
};
