import { Die, GameData, RackNumber } from "@knucklebones/shared/types.js";
import { getRacks } from "@knucklebones/shared/utilities/get-racks.js";
import { randomIntBetween } from "@knucklebones/shared/utilities/random-int-between.js";
import { getRackScore } from "~/utilities/score.js";
import { botId } from "~/utilities/server-id.js";

type RackPointsGained = [number, number, number];

export const nextBotMove = ({
  gameData,
  newDieValue,
}: {
  gameData: GameData;
  newDieValue: number;
}): RackNumber => {
  const bot = gameData.players.find((i) => i.id === botId);
  const botRacks = getRacks(bot?.dice || [], true);

  const opponent = gameData.players.find((i) => i.id !== botId);
  const opponentRacks = getRacks(opponent?.dice || [], true);

  // lost of how many points are gained with each rack
  const rackPointsIncrease: RackPointsGained = [0, 0, 0];

  // simulate moves
  simulateBotRacks({ botRacks, rackPointsIncrease, newDieValue });
  simulateOpponentRacks({ opponentRacks, rackPointsIncrease, newDieValue });

  // highest score
  const chosenRack = pickRack(rackPointsIncrease);
  return chosenRack;
};

// Simulate how many points the bot gains for its own racks
const simulateBotRacks = ({
  botRacks,
  rackPointsIncrease,
  newDieValue,
}: {
  botRacks: Die[][];
  rackPointsIncrease: RackPointsGained;
  newDieValue: number;
}) => {
  // simulate placing the new die in each rack so see which move has the most points
  for (const rackNr of [0, 1, 2]) {
    const simulateRack = structuredClone(botRacks[rackNr]);

    // if rack is already filled, prevent picking it
    if (simulateRack.length === 3) {
      rackPointsIncrease[rackNr] = -999;
      continue;
    }

    simulateRack.push({
      created: "",
      id: "",
      rack: rackNr,
      status: "active",
      value: newDieValue,
    });

    const oldScore = getRackScore(botRacks[rackNr]);
    const newScore = getRackScore(simulateRack);
    rackPointsIncrease[rackNr] = newScore - oldScore;
  }
};

// Simulate how many points the opponent loses for each rack
const simulateOpponentRacks = ({
  opponentRacks,
  rackPointsIncrease,
  newDieValue,
}: {
  opponentRacks: Die[][];
  rackPointsIncrease: RackPointsGained;
  newDieValue: number;
}) => {
  // simulate how many points are removed for each rack
  for (const rackNr of [0, 1, 2]) {
    // remove dice with same value
    const newOpponentRack = opponentRacks[rackNr].filter(
      (i) => i.value !== newDieValue
    );

    const oldScore = getRackScore(opponentRacks[rackNr]);
    const newScore = getRackScore(newOpponentRack);

    // increase points by amount of points opponent loses
    rackPointsIncrease[rackNr] += oldScore - newScore;
  }
};

/**
 * One or more racks can have the same high score, pick a random one
 *
 * e.g. rackPointsIncrease [ 2, 6, 2 ] > [1]
 * e.g. rackPointsIncrease [ 2, 6, 6 ] > [1,2]
 */
const pickRack = (rackPointsIncrease: RackPointsGained): number => {
  const max = Math.max(...rackPointsIncrease);

  // list indices with highest score
  const maxIndices = rackPointsIncrease
    .map((val, i) => (val === max ? i : -1))
    .filter((i) => i !== -1);

  // pick a random index
  const randomMaxIndice = randomIntBetween(0, maxIndices.length - 1);
  const chosenRack = maxIndices[randomMaxIndice];

  return chosenRack;
};
