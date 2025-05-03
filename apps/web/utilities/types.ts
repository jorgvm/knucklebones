export type DieStatus = "active" | "removed";

export type RackNumber = 0 | 1 | 2;

export type Die = {
  created: string;
  id: string;
  rack: RackNumber;
  status: DieStatus;
  value: number;
};

export type Rack = Die[];

export type Racks = [Rack, Rack, Rack];

export type PlayerId = string;

export type GameId = string;

export type PlayerName = string;

export type Player = {
  dice: Die[];
  host: boolean;
  id: PlayerId;
  name: PlayerName;
  score: number;
};

export type GameStatus =
  | "lobby" // waiting on more players
  | "playing" // playing the game
  | "finished"; // there is a winner

export type GameData = {
  active_player: PlayerId | null;
  created: string;
  id: GameId;
  new_die: number;
  players: Player[];
  status: GameStatus;
  version: number;
  winner: PlayerId | null;
};
