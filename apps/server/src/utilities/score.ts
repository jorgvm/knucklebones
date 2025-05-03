import type { Player, Rack, Racks } from "@shared/types";

/**
 * Sum each rack score
 */
export const getPlayerScore = (player: Player) => {
  const racks: Racks = [[], [], []];

  player.dice.forEach((die) => {
    racks[die.rack].push(die);
  });

  return racks.reduce((acc, curr) => acc + getRackScore(curr), 0);
};

/**
 * Get score for each rack
 *
 * Multiply each die by the amount of occurences in the rack
 * [5] = 5*1
 * [2,2] = 2*2 + 2*2
 * [2,2,2] = 2*3 + 2*3 + 2*3
 */
export const getRackScore = (rack: Rack): number => {
  const activeDice = rack.filter((die) => die.status === "active");
  const diceValues = activeDice.map((die) => die.value);

  const rackScores = diceValues.map((value) => {
    const multiplier = diceValues.filter((i) => i === value).length;
    return value * multiplier;
  });

  return rackScores.reduce((acc, curr) => acc + curr, 0);
};
