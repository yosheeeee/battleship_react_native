import authorizationService from "../services/authorization";
import { Request, Response } from "express"

export default function authorizationMiddleware(req: Request, res: Response, next: any) {
  //@ts-ignore
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.sendStatus(401)
  }
  const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>
  if (!token) {
    res.sendStatus(401)
  }

  try {
    const user = authorizationService.decodeJWTToken(token as string)
    //@ts-ignore
    req.user = user
    next()
  } catch (e) {
    res.sendStatus(401)
  }
}
