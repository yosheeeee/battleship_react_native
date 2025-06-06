import { PrismaClient } from "../../../generated/prisma";
import { ChangeGameStateResponse, GamePhase, GameRoom } from "./types";

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
    }
    return {
      gamePhase:
        existingGameRoom.users.length == 2
          ? GamePhase.PLACEMENT
          : GamePhase.WAITING_FOR_PLAYERS,
      roomId: existingGameRoom.id,
    };
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
