import { error } from "console";
import { PrismaClient } from "../../../generated/prisma";
import {
  Board,
  Cell,
  CellState,
  ChangeGameStateResponse,
  GamePhase,
  GameRoom,
  Ship,
} from "./types";

class BattleService {
  gameRooms: GameRoom[];
  dbClient;

  constructor() {
    this.gameRooms = [];
    this.dbClient = new PrismaClient();
  }

  async findRoomToUser(
    socketId: string,
    userId: number,
  ): Promise<ChangeGameStateResponse> {
    let gameRooms = await this.dbClient.gameRoom.findMany({
      where: {
        private: false,
      },
      include: { users: true },
    });
    let existingGameRoom =
      gameRooms.filter((r) => r.users.length <= 1)[0] ?? null;
    if (existingGameRoom == null) {
      //@ts-ignore
      existingGameRoom = await this.createRoom(false, userId);
    } else {
      //@ts-ignore
      existingGameRoom = await this.dbClient.gameRoom.update({
        include: {
          users: true,
        },
        where: {
          id: existingGameRoom.id,
        },
        data: {
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });
      let room = this.gameRooms.find((r) => r.id == existingGameRoom.id);
      room?.players.push({
        id: userId,
        isReady: false,
        board: [],
        ships: [],
      });
    }
    return {
      gamePhase:
        existingGameRoom.users.length == 2
          ? GamePhase.PLACEMENT
          : GamePhase.WAITING_FOR_PLAYERS,
      roomId: existingGameRoom.id,
    };
  }

  async setUserBattleField(userId: number, battleField: CellState[][]) {
    const gameRoom = this.gameRooms.find((g) =>
      g.players.find((p) => p.id == userId),
    );
    const gameRoomUser = gameRoom?.players.find((p) => p.id == userId);
    if (!gameRoomUser) {
      throw new Error("game room with user not found");
    }
    const boardData = this.convertBattleFieldState(battleField);
    gameRoomUser.board = boardData.board;
    gameRoomUser.ships = boardData.ships;
    gameRoomUser.isReady = true;
    const isAllReady = gameRoom?.players.filter((p) => p.isReady).length == 2;
    if (!isAllReady) {
      return { isAllReady };
    } else {
      return {
        isAllReady,
        turnPlayerId: gameRoom.players[0].id,
      };
    }
  }

  //TODO: написать функцию конвертации поля
  private convertBattleFieldState(battleField: CellState[][]): {
    board: Board;
    ships: Ship[];
  } {
    const rows = battleField.length;
    const cols = battleField[0]?.length || 0;
    let firstShipId = 1;

    const board: Cell[][] = [];
    const ships: Ship[] = [];

    const visited = new Set<string>(); // для отслеживания уже обработанных частей корабля

    for (let row = 0; row < rows; row++) {
      const boardRow: Cell[] = [];
      for (let col = 0; col < cols; col++) {
        const state = battleField[row][col];
        const cell: Cell = {
          state,
          shipId: undefined,
        };

        if (state === CellState.SHIP) {
          // Проверяем, принадлежит ли эта часть уже существующему кораблю
          const up = row > 0 ? battleField[row - 1][col] : CellState.EMPTY;
          const left = col > 0 ? battleField[row][col - 1] : CellState.EMPTY;
          const upShipId = row > 0 ? board[row - 1][col]?.shipId : undefined;
          const leftShipId = col > 0 ? board[row][col - 1]?.shipId : undefined;

          let shipId: number | undefined;

          if (up === CellState.SHIP) {
            shipId = upShipId;
          } else if (left === CellState.SHIP) {
            shipId = leftShipId;
          }

          if (!shipId) {
            // Это начало нового корабля
            shipId = firstShipId;
            firstShipId++;
          }

          cell.shipId = shipId;

          // Находим или создаём информацию о корабле
          const existingShipIndex = ships.findIndex((s) => s.id === shipId);
          if (existingShipIndex >= 0) {
            ships[existingShipIndex].length += 1;
          } else {
            ships.push({
              id: shipId,
              type: "unknown", // можно позже заменить на "destroyer", "cruiser" и т.д.
              length: 1,
              hits: 0,
              isSunk: false,
            });
          }
        }

        boardRow.push(cell);
      }
      board.push(boardRow);
    }

    // После сборки всех кораблей можем уточнить их типы по длине
    for (const ship of ships) {
      if (ship.length === 1) {
        ship.type = "submarine";
      } else if (ship.length === 2) {
        ship.type = "destroyer";
      } else if (ship.length === 3) {
        ship.type = "cruiser";
      } else if (ship.length === 4) {
        ship.type = "battleship";
      } else {
        ship.type = "unknown";
      }
    }

    return { board, ships };
  }

  private async createRoom(isPrivate: boolean, userId: number) {
    let room = await this.dbClient.gameRoom.create({
      include: { users: true },
      data: {
        private: isPrivate,
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
    this.gameRooms.push({
      id: room.id,
      players: [
        {
          id: userId,
          board: [],
          ships: [],
          isReady: false,
        },
      ],
    });
    return room;
  }

  async connectUserToRoom(
    roomId: number,
    socketId: string,
    userId: number,
  ): Promise<ChangeGameStateResponse> {
    let game = await this.dbClient.gameRoom.findFirst({
      where: {
        id: roomId,
      },
    });
    if (game == null) {
      throw new Error("game with this code not found");
    }
    await this.dbClient.gameRoom.update({
      where: {
        id: roomId,
      },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
    let gameRoom = this.gameRooms.find((r) => r.id == roomId);
    gameRoom?.players.push({
      id: userId,
      ships: [],
      board: [],
      isReady: false,
    });
    return {
      roomId,
      gamePhase: GamePhase.PLACEMENT,
    };
  }

  async createRoomToUser(
    socketId: string,
    userId: number,
  ): Promise<ChangeGameStateResponse> {
    let room = await this.createRoom(true, userId);
    return {
      roomId: room.id,
      gamePhase: GamePhase.WAITING_FOR_PLAYERS,
    };
  }

  async disconnectUserFromGame(userId: number) {
    let gamesWithUser = await this.dbClient.gameRoom.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      },
    });

    for (let game of gamesWithUser) {
      for (let user of game.users) {
        if (user.id === userId) {
          await this.dbClient.user.update({
            where: {
              id: user.id,
            },
            data: {
              loseGamesCount: {
                increment: 1,
              },
            },
          });
        } else {
          await this.dbClient.user.update({
            where: {
              id: user.id,
            },
            data: {
              winGamesCount: {
                increment: 1,
              },
            },
          });
        }
      }
    }

    await this.dbClient.gameRoom.deleteMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
    return gamesWithUser.map((game) => game.id);
  }
}

export default new BattleService();
