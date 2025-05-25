import path from "path";
import { PrismaClient } from "../../generated/prisma";
import { RequestWithUser } from "./authorization";
import { Response } from "express";
import fs from "fs";

export interface IUserMainInfo {
  nickname: string;
  avatarUrl?: string;
  winGamesCount: number;
  loseGamesCount: number;
  hasCurrentGame: boolean;
  currentGameId?: number;
}
const prisma = new PrismaClient();

async function getUserMainIinfo(req: RequestWithUser, res: Response) {
  const user = req.user;
  const dbUser = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
    include: {
      currentGame: true,
    },
  });

  if (dbUser == null || dbUser == undefined) {
    res.sendStatus(401);
  }

  const hasCurrentGame = dbUser?.currentGame != null;

  const response: IUserMainInfo = {
    nickname: dbUser!.nickname,
    winGamesCount: dbUser!.winGamesCount,
    loseGamesCount: dbUser!.loseGamesCount,
    hasCurrentGame,
    //@ts-ignore
    avatarUrl: dbUser?.avatarUrl,
  };
  if (response.hasCurrentGame) {
    //@ts-ignore
    response.currentGameId = dbUser!.currentGameId;
  }
  res.send(response);
}

async function uploadAvatar(req: RequestWithUser, res: Response) {
  const tokenInfo = req.user;
  //@ts-ignore
  const newAvatarPath = req.fileName;

  try {
    const user = await prisma.user.findUnique({
      where: { id: tokenInfo.id },
    });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Удалить старый аватар, если он существует
    if (user.avatarUrl) {
      const oldImagePath = path.join(__dirname, "../static", user.avatarUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Обновляем аватар в базе данных
    const updatedUser = await prisma.user.update({
      where: { id: tokenInfo.id },
      data: {
        avatarUrl: newAvatarPath,
      },
    });

    res.json({ avatarUrl: updatedUser.avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

export default { getUserMainIinfo, uploadAvatar };
