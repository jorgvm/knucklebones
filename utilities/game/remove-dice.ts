import type { Dice } from "~/utilities/types";

/**
 * Update dice in a specific rack to 'removed' status.
 *
 * When a die is placed, dice in the opponent's same rack, with the same value, are removed.
 */
export const removeDice = ({
  dice,
  rackNumber,
  diceValue,
}: {
  dice: Dice[];
  rackNumber: number;
  diceValue: number;
}): Dice[] => {
  return dice.map((dice) => {
    if (dice.rack === rackNumber && dice.value === diceValue) {
      dice.status = "removed";
    }
    return dice;
  });
};
