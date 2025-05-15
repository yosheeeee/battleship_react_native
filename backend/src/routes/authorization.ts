import express from "express";
import authorizationService from "../services/authorization.ts";

const authorizationRouter = express.Router();

authorizationRouter.post("/login", authorizationService.login);
authorizationRouter.post("/register", authorizationService.registration);

export default authorizationRouter;
