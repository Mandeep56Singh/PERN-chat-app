import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import prisma from "../db/prisma";
import { generateToken } from "../utils/generateToken";
export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password doesn't match" });
    }
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hashing the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender == "male" ? boyProfilePic : girlProfilePic,
      },
    });

    if (newUser) {
      // generate new token in a sec
      generateToken(newUser.id,res)
      res.status(201).json({
        id: newUser.id,
        fullName: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "invalid user data" });
    }
  } catch (error: any) {
    console.log("Error in signup", error.message);
  }
};
