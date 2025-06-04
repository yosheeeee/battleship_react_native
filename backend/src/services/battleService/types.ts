export const BOARD_SIZE = 10;

export enum CellState {
  EMPTY = 0, // Пусто
  SHIP = 1, // Корабль
  HIT = 2, // Попадание
  MISS = 3, // Промах
  SUNK = 4, // Потоплен (часть корабля)
}

export interface Cell {
  state: CellState;
  shipId?: number;
}

export type Board = Cell[][];

export interface Ship {
  id: number;
  type: string;
  length: number;
  hits: number;
  isSunk: boolean;
}

export interface ShipPlacementData {
  type: string;
}

export interface Player {
  id: number;
  board: Board;
  ships: Ship[];
  isReady: boolean;
}

export enum GamePhase {
  WAITING_FOR_PLAYERS = "waiting_for_players",
  STARTING_GAME = "starting_game",
  PLACEMENT = "placement",
  PLAYER_TURN = "player_turn",
  GAME_OVER = "game_over",
}

export enum GameOverReason {
  USER_LEAVE,
  USER_WIN,
}

interface GameOverResponse {
  gamePhase: GamePhase.GAME_OVER;
  gameOverReason: GameOverReason;
  winUserId: number;
}

interface ChangeUserTurnResponse {
  gamePhase: GamePhase.PLAYER_TURN;
  playerTurnId: number;
}

interface DefaultChangeGameStateResponse {
  gamePhase:
    | GamePhase.WAITING_FOR_PLAYERS
    | GamePhase.STARTING_GAME
    | GamePhase.PLACEMENT;
}

export type ChangeGameStateResponse = { roomId: number } & (
  | DefaultChangeGameStateResponse
  | ChangeUserTurnResponse
  | GameOverResponse
);

export interface GameRoom {
  id: number;
  players: Player[];
}

export const SHIP_CONFIG = [
  { type: "carrier", length: 4 }, // Авианосец (в классике 4, но часто делают 5)
  { type: "battleship", length: 3 }, // Линкор
  { type: "battleship", length: 3 },
  { type: "cruiser", length: 2 }, // Крейсер
  { type: "cruiser", length: 2 },
  { type: "cruiser", length: 2 },
  { type: "destroyer", length: 1 }, // Эсминец
  { type: "destroyer", length: 1 },
  { type: "destroyer", length: 1 },
  { type: "destroyer", length: 1 },
];

export interface SocketData {
  roomId?: number;
  playerId?: string;
}
