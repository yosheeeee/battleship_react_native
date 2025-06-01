import { Server } from "socket.io";
import authorization from "./services/authorization";
import BattleService from "./services/battleService";
import { GameOverReason, GamePhase } from "./services/battleService/types";

const battleService = BattleService;

enum SocketBackendEvents {
  UPDATE_GAME_STATE = "update_game_state",
}

enum SocketClientEvents {
  JOIN_ROOM = "join_room",
  CREATE_ROOM = "create_room",
  SEARCH_ROOM = "search_room",
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
  });
}
