import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import createError, { ErrorTypes } from "../functions/createError.ts";

const prisma = new PrismaClient();

interface HashedPassword {
  hash: string;
  salt: string;
}

interface IRegistrationRequest extends ILoginRequest {
  nickname: string;
}

interface ILoginRequest {
  email: string;
  password: string;
}

async function login(_: Request, res: Response) {
  let body = res.body as ILoginRequest;

  if (!body || !body.email || !body.password) {
    res.status(400);
    return;
  }

  let existedUser = await prisma.users.findFirst({
    where: {
      email: body.email,
    },
  });
  if (!!existedUser) {
    res.status(400).send(
      createError({
        type: ErrorTypes.FIELD,
        field: "email",
        error: "user with this email not found",
      }),
    );
  }

  if (!(await isPasswordCorrect(body.password, existedUser.password))) {
    res.status(400).send(
      createError({
        type: ErrorTypes.FIELD,
        field: "password",
        error: "password incorrect",
      }),
    );
  }

  const token = await generateUserToken(existedUser);

  await res.send({
    token,
  });
}

async function generateUserToken(user: any): Promise<string> {
}

async function registration(req: Request, res: Response) {
  await res.send({
    message: "registration",
  });
}

async function hashPassword(password: string): Promise<HashedPassword> {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  return {
    salt,
    hash: hashedPassword,
  };
}

async function isPasswordCorrect(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export default {
  login,
  registration,
};
