import express from "express";
import authorizationService from "../services/authorization.ts";
import authorizationMiddleware from "../middlewares/authMiddleware.ts";

const authorizationRouter = express.Router();

authorizationRouter.post("/login", authorizationService.login);
authorizationRouter.post("/register", authorizationService.registration);

//@ts-ignore
authorizationRouter.get("/check-token", authorizationMiddleware, authorizationService.checkToken)

export default authorizationRouter;
