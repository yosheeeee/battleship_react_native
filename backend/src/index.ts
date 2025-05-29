import express from "express";
import router from "./routes/index.ts";
import cors from "cors";
import path from "path";
import http from "http";
import initSocket from "./socket.ts";
import { PrismaClient } from "../generated/prisma/index";

const app = express();

app.use(express.json());
app.use(router);
app.use(cors());
app.use("/static", express.static(path.join(__dirname, "../static")));
const httpServer = http.createServer(app);
initSocket(httpServer);
//dev-function
removeOldGames().then(() =>
  httpServer.listen(5000, () => {
    console.log("servier is running on port 5000");
  }),
);

async function removeOldGames() {
  let dbClient = new PrismaClient();
  await dbClient.gameRoom.deleteMany();
}
