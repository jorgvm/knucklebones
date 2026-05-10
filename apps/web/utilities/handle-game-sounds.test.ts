import { describe, it, expect, vi, beforeEach } from "vitest";
import type { GameData } from "@shared/types";
import { handleGameSounds } from "~/utilities/handle-game-sounds";
import { playSound } from "~/utilities/play-sound";
import { vibrate } from "~/utilities/vibrate";
import { waitFor } from "@shared/utilities/wait-for";

vi.mock("~/utilities/play-sound", () => ({ playSound: vi.fn() }));
vi.mock("~/utilities/vibrate", () => ({ vibrate: vi.fn() }));
vi.mock("@shared/utilities/random-int-between", () => ({
  randomIntBetween: vi.fn(() => 2),
}));
vi.mock("@shared/utilities/wait-for", () => ({
  waitFor: vi.fn(() => Promise.resolve()),
}));

const baseGame = (): GameData => ({
  id: "g1",
  active_player: "p1",
  created: "",
  new_die: 1,
  players: [],
  status: "playing",
  version: 1,
  winner: [],
  secrets: [],
  rematch_id: null,
  latest_actions: [],
  type: "multiplayer",
});

describe("handleGameSounds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns early when no actions", async () => {
    await handleGameSounds(baseGame(), "p1");
    expect(playSound).not.toHaveBeenCalled();
  });

  it("plays place sound on die_placed", async () => {
    await handleGameSounds(
      { ...baseGame(), latest_actions: ["die_placed"] },
      "p1",
    );
    expect(playSound).toHaveBeenCalledWith("place-2");
  });

  it("plays start sound on game_created", async () => {
    await handleGameSounds(
      { ...baseGame(), latest_actions: ["game_created"] },
      "p1",
    );
    expect(playSound).toHaveBeenCalledWith("start-game-1", 0.2);
  });

  it("plays won sound when local player wins", async () => {
    const game: GameData = {
      ...baseGame(),
      latest_actions: ["game_finished"],
      winner: ["p1"],
    };
    await handleGameSounds(game, "p1");
    expect(playSound).toHaveBeenCalledWith("won-2", 0.6);
  });

  it("plays lost sound when local player loses", async () => {
    const game: GameData = {
      ...baseGame(),
      latest_actions: ["game_finished"],
      winner: ["p2"],
    };
    await handleGameSounds(game, "p1");
    expect(playSound).toHaveBeenCalledWith("lost-1", 0.3);
  });

  it("waits, vibrates and plays destroy sound on die_removed", async () => {
    await handleGameSounds(
      { ...baseGame(), latest_actions: ["die_removed"] },
      "p1",
    );
    expect(waitFor).toHaveBeenCalledWith(1000);
    expect(vibrate).toHaveBeenCalled();
    expect(playSound).toHaveBeenCalledWith("destroy-1", 0.8);
  });
});
