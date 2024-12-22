import { Response } from "express";
import jwt from "jsonwebtoken";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const expiretime = process.env.accessTokenExpireTime;
export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, PRIVATE_KEY!, { expiresIn: expiretime });

  res.cookie("accessToken", token, {
    maxAge: 900000, // 15 mins
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_EVN !== "development",
  });

  return token;
};
