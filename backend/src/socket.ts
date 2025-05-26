import { Server } from "socket.io";
import authorization from "./services/authorization";

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

    //TODO: connecting to room by key
    socket.on("join-room", async (roomKey: number) => {
      socket.emit("connected to room");
    });

    //TODO: searching room
    socket.on("search-room", async () => {});

    //TODO: creating room
    socket.on("create-room", async () => {});
  });
}
