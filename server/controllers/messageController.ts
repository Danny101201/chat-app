import { Request, Response, NextFunction } from "express";
import type { Message } from '../modal/messageSchema';
import MessageModal from '../modal/messageSchema';
import UserModal from '../modal/userModal';
import { validationAddMessage } from "../utils/validationSchema";

export const addMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { message, from, to } = req.body
    const { error } = validationAddMessage(req.body)

    if (error) return res.status(404).json({ message: error.details[0].message })
    const messageRes = await MessageModal.create({
      message,
      users: [from, to],
      sender: from
    })
    if (messageRes) return res.status(200).json({ message: 'success send message' })
    return res.status(404).json({ message: 'fail to send message to database' })
  } catch (e) {
    // next(e)
  }
}

export const getAllMessage = async (req: Request, res: Response, next: NextFunction) => {
  const { from, to } = req.body
  const receiverAvatars = await UserModal.findById(to).select(['AvatarImage', '-_id'])

  const messages = await MessageModal.find({
    users: {
      $all: [from, to]
    }
  }).sort({
    updatedAt: 1
  }).then(res => res.map(m => {
    return ({
      message: m.message,
      fromSelf: from === m.sender.toString(),
      receiverAvatars
    })
  }
  ))
  return res.status(200).json({ messages })

}



