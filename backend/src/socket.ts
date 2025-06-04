import { Server } from "socket.io";
import authorization from "./services/authorization";
import BattleService from "./services/battleService";
import {
  CellState,
  GameOverReason,
  GamePhase,
} from "./services/battleService/types";

const battleService = BattleService;

enum SocketBackendEvents {
  UPDATE_GAME_STATE = "update_game_state",
  PLAYER_READY_UPDATE = "player_ready_update",
}

enum SocketClientEvents {
  JOIN_ROOM = "join_room",
  CREATE_ROOM = "create_room",
  SEARCH_ROOM = "search_room",
  PLAYER_READY = "player_ready",
}

export default function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    //@ts-ignore
    auth: {},
  });

  io.use((socket, next) => {
    const token =
      socket.handshake.auth.token ?? (socket.handshake.headers.token as string);
    if (!token) {
      return next(new Error("No auth token provided"));
    }
    try {
      const userPayload = authorization.decodeJWTToken(token);
      socket.data.user = userPayload;
      next();
    } catch (e) {
      console.error(e);
      //@ts-ignore
      return next(new Error(e?.message));
    }
  });

  io.on("connection", async (socket) => {
    const user = socket.data.user;
    console.log("user conected");
    console.dir(user);

    socket.on("disconnect", async () => {
      console.log("user disconnected");
      try {
        const roomIds = await battleService.disconnectUserFromGame(user.id);
        let socketEmitTo = io;
        if (roomIds && roomIds.length) {
          roomIds.forEach((roomId) => {
            //@ts-ignore
            socketEmitTo = socketEmitTo.to;
          });
          socketEmitTo.emit(SocketBackendEvents.UPDATE_GAME_STATE, {
            gamePhase: GamePhase.GAME_OVER,
            gameOverReason: GameOverReason.USER_LEAVE,
          });
        }
      } catch (e) {
        console.error("Error handling disconnect:", e);
      }
    });

    socket.on(SocketClientEvents.JOIN_ROOM, async (roomKey: number) => {
      console.log("joining room:", roomKey);
      try {
        let response = await battleService.connectUserToRoom(
          +roomKey,
          socket.id,
          user.id,
        );
        socket.join(response.roomId.toString());
        io.to(response.roomId.toString()).emit(
          SocketBackendEvents.UPDATE_GAME_STATE,
          response,
        );
      } catch (e) {
        //@ts-ignore
        console.log("error join:", e.message);
        socket.emit("join_error", "Room with this key not found");
      }
    });

    socket.on(SocketClientEvents.SEARCH_ROOM, async () => {
      let response = await battleService.findRoomToUser(socket.id, user.id);
      socket.join(response.roomId.toString());
      io.to(response.roomId.toString()).emit(
        SocketBackendEvents.UPDATE_GAME_STATE,
        response,
      );
    });

    socket.on(SocketClientEvents.CREATE_ROOM, async () => {
      console.log("creating room");
      let response = await battleService.createRoomToUser(socket.id, user.id);
      socket.join(response.roomId.toString());
      io.to(response.roomId.toString()).emit(
        SocketBackendEvents.UPDATE_GAME_STATE,
        response,
      );
    });

    // Handle player ready state
    socket.on(
      SocketClientEvents.PLAYER_READY,
      async (battleField: CellState[][]) => {
        try {
          let { isAllReady, turnPlayerId: playerTurnId } =
            await battleService.setUserBattleField(
              socket.data.user.id,
              battleField,
            );
          // Get the rooms this socket is in
          const socketRooms = Array.from(socket.rooms).filter(
            (room) => room !== socket.id,
          );

          if (socketRooms.length === 0) {
            console.error("Socket is not in any room");
            return;
          }

          // Broadcast to all clients in the room except the sender
          const roomId = socketRooms[0]; // Assuming the player is only in one game room
          if (isAllReady) {
            socket.to(roomId).emit(SocketBackendEvents.UPDATE_GAME_STATE, {
              gamePhase: GamePhase.STARTING_GAME,
              playerTurnId,
            });
          } else {
            socket.to(roomId).emit(SocketBackendEvents.PLAYER_READY_UPDATE, {
              playerId: user.id,
              isReady: true,
            });
          }
        } catch (e) {
          console.error("Error handling player ready state:", e);
        }
      },
    );
  });
}
