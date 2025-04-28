import type { Player, Rack, Racks } from "~/utilities/types";

// Update given player with calculated socre
export const updateScore = (player: Player) => {
  player.score = getPlayerScore(player);
};

/**
 * Sum each rack score
 */
const getPlayerScore = (player: Player) => {
  const racks: Racks = [[], [], []];

  const activeDice = player.dice.filter((dice) => dice.status === "active");

  activeDice.forEach((dice) => {
    racks[dice.rack].push(dice);
  });

  return racks.reduce((acc, curr) => acc + getRackScore(curr), 0);
};

/**
 * Get score for each rack
 *
 * Multiply each die by the amount of occurences in the rack
 * [5] = 5*1
 * [2,2] = 2*2 + 2*2
 * [4,1,4] = 4*4 + 1*1 + 4*4
 */
export const getRackScore = (rack: Rack): number => {
  const diceValues = rack.map((dice) => dice.value);

  const rackScores = diceValues.map((v) => {
    const multiplier = diceValues.filter((i) => i === v).length;
    return v * multiplier;
  });

  return rackScores.reduce((acc, curr) => acc + curr, 0);
};
