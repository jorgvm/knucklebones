import { describe, it, expect } from "vitest";
import { mockGameData } from "~/utilities/mock-game.js";
import { toPublicGameData } from "~/utilities/to-public-gamedata.js";

interface GameData {
  name: string;
  players: string[];
  secrets: string[];
  otherData?: number;
}

describe("toPublicGameData", () => {
  it("should remove the secrets array from the game data", () => {
    const publicData = toPublicGameData(mockGameData);
    expect(publicData.secrets).toEqual([]);
  });

  it("should keep other properties of the game data unchanged", () => {
    const publicData = toPublicGameData(mockGameData);
    expect(publicData.players[0].name).toBe("john");
  });
});
