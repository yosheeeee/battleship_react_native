import { Request, Response } from "express";
import bcrypt from "bcrypt";
import createError, { ErrorTypes } from "../functions/createError.ts";
import { PrismaClient } from "../../generated/prisma/";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const secretKey = process.env.TOKEN_PRIVATE_KEY

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

async function login(req: Request, res: Response) {
  let body = req.body as ILoginRequest;

  if (!body || !body.email || !body.password) {
    res.status(400);
    return;
  }

  let existedUser = await prisma.user.findFirst({
    where: {
      email: body.email.toLowerCase(),
    },
  });

  if (!existedUser) {
    res.status(400).send(
      createError({
        type: ErrorTypes.FIELD,
        field: "email",
        error: "user with this email not found",
      }),
    );
  }

  if (!(await isPasswordCorrect(body.password, existedUser?.passwordHash as string))) {
    res.status(400).send(
      createError({
        type: ErrorTypes.FIELD,
        field: "password",
        error: "password incorrect",
      }),
    );
  }

  const token = generateUserToken(existedUser);

  res.send({
    token,
  });
}

function generateUserToken(user: any): string {
  if (!secretKey) {
    throw new Error("secret key not found in .env file")
  }
  const token = jwt.sign({
    email: user.email,
    nickname: user.nickname
  }, secretKey)

  return token
}

async function registration(req: Request, res: Response) {
  let body = req.body as IRegistrationRequest

  console.log(req.body)

  if (!body || !body.email || !body.password || !body.nickname) {
    res.status(400);
    return;
  }

  let existedUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          nickname: body.nickname.toLowerCase()
        },
        {
          email: body.email.toLowerCase()
        }
      ]
    }
  })
  if (existedUser != null) {
    if (body.email.toLowerCase() == existedUser.email) {
      res.status(400).send(createError({ type: ErrorTypes.FIELD, error: "user with this email is already exists", field: "email" }))
    }
    if (body.nickname.toLowerCase() == existedUser.nickname) {
      res.status(400).send(createError({ type: ErrorTypes.FIELD, error: "user with this nickname is already exists", field: "nickname" }))
    }
  }

  let passwordHash = await hashPassword(body.password)

  let user = await prisma.user.create({
    data: {
      email: body.email,
      nickname: body.nickname,
      passwordHash: passwordHash.hash,
      passwordSalt: passwordHash.salt
    }
  })

  const token = generateUserToken(user)

  res.send({
    message: "registered",
    id: user.id,
    token
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

function decodeJWTToken(token: string) {
  let userData = {}

  jwt.verify(token, secretKey as string, (err, user) => {
    if (err) throw Error(err.message)
    //@ts-ignore
    userData = user
  })

  return userData
}

type RequestWithUser = Request & { user: { nickname: string, email: string } }

function checkToken(req: RequestWithUser, res: Response) {
  res.send({
    user: req.user
  })
}

export default {
  login,
  registration,
  decodeJWTToken,
  checkToken
};
