import { Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); 

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const expiretime = process.env.accessTokenExpireTime;

if (!PRIVATE_KEY || !expiretime) {
  throw new Error(
    "Environment variables PRIVATE_KEY or accessTokenExpireTime are missing."
  );
}

export const generateToken = (userId: string, res: Response) => {
  console.log("PRIVATE_KEY:", PRIVATE_KEY); 
  console.log("accessTokenExpireTime:", expiretime); 

  const token = jwt.sign({ userId }, PRIVATE_KEY!, { expiresIn: expiretime });

  res.cookie("accessToken", token, {
    maxAge: 900000, // 15 mins
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development", //
  });

  return token;
};
