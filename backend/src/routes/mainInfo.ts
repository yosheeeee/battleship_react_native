import express from "express";
import mainInfoService from "../services/mainInfoService";
import authorizationMiddleware from "../middlewares/authMiddleware";
import multerService from "../services/multerService";

const router = express.Router();
//@ts-ignore
router.get("", authorizationMiddleware, mainInfoService.getUserMainIinfo);
router.post(
  "/upload-avatar",
  multerService.single("image"),
  authorizationMiddleware,
  //@ts-ignore
  mainInfoService.uploadAvatar,
);

export default router;
