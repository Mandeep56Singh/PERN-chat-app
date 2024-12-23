import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../db/prisma.js";

type DecodedToken = JwtPayload & {
  userId: string;
};

// Declaration Merging: It allows you to extend the types of existing libraries or modules.
declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
      };
    }
  }
}
export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    // get payload data from jwt token i.e. accesstoken
    const decoded = jwt.verify(token, PRIVATE_KEY!) as DecodedToken;
    if (!decoded) {
      return res.status(401).json({ error: "Token either expired or Invalid" });
    }
    // get user data
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        profilePic: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    req.user = user;

    next();
  } catch (error: any) {
    console.log("Error in protectedRoute middleware", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
