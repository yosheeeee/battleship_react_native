import express from "express";
import authorizationRouter from "./authorization.ts";
import mainInfoRouter from "./mainInfo.ts";

const indexRouter = express.Router();

indexRouter.use("/auth", authorizationRouter);
indexRouter.use("/main-info", mainInfoRouter);

export default indexRouter;
