import { Request, Response } from "express";
import prisma from "../db/prisma.js";

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {

    // message text to be send
    const { message } = req.body;

    const { id: recieverId } = req.params;
    const senderId = req.user.id;

    console.log("sender data",senderId, message)
    console.log("reciever data \n","id: ",recieverId)
    // check if sender had previous conversation with receiver
    let conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, recieverId],
        },
      },
    });
    if (!conversation) {
      // it's first message, create a new conversation
      console.log("First conversation")
      conversation = await prisma.conversation.create({
        data: {
          participantIds: {
            set: [senderId, recieverId],
          },
        },
      });
    }

    // Create the message by adding additional data
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        conversationId: conversation.id,
      },
    });
    console.log("first message", newMessage)
    // add the message to conversation
    if (newMessage) {
      conversation = await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }

    //

    res.status(201).json(newMessage);
  } catch (error: any) {
    console.log("Error in sendMessage Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
