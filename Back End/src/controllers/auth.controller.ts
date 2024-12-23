import bcryptjs from "bcryptjs";
import { Request, Response } from "express";

import { generateToken } from "../utils/generateToken.js";
import prisma from "../db/prisma.js";
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
      generateToken(newUser.id, res);
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

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).json({ error: "User doesn't exist" });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Password incorrect" });
    }

    // now user credentials are checked and are correct. Generate a token for the user
    generateToken(user.id, res);

    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error: any) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("accessToken", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.log("Error in logout Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
