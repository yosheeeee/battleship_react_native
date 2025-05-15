import express from "express";
import authorizationRouter from "./authorization.ts";

const indexRouter = express.Router();

indexRouter.use("/auth", authorizationRouter);

export default indexRouter;
