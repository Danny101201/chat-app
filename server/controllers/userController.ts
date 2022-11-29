import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import type { User } from '../modal/userModal';
import UserModal from '../modal/userModal';
export const register = async (req: Request<{}, {}, User>, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) return res.json('username email password is required')
  const duplicateUser = await UserModal.findOne({ username })
  const duplicateEmail = await UserModal.findOne({ email })
  if (duplicateUser) return res.status(401).json({ message: 'userName has been register' })
  if (duplicateEmail) return res.status(401).json({ message: 'email has been register' })
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser: Partial<User> = await UserModal.create({
    username,
    email,
    password: hashPassword
  })
  delete newUser.password
  return res.status(200).json({ username: newUser.username, message: 'signup success' })
}
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  const user = await UserModal.findOne({ username })
  if (!user) return res.status(401).json({ message: 'Incorrect username' })
  const isPasswordVaild = bcrypt.compareSync(password, user.password)
  if (!isPasswordVaild) return res.status(401).json({ message: 'Incorrect password' })
  return res.status(200).json(
    {
      uid: user._id,
      username: user.username,
      AvatarImage: user.AvatarImage,
      isAvatarImageSet: user.isAvatarImageSet,
      message: 'login success'
    })
}

export const setAvator = async (req: Request, res: Response, next: NextFunction) => {
  const { AvatarImage, username } = req.body
  if (!username || !AvatarImage) return res.status(404).json({ message: 'username AvatarImage is required' })
  const user = await UserModal.findOne({ username })
  if (!user) return res.status(404).json({ message: 'user not found' })
  // const isUserAvatarImageSet = await UserModal.findOne({ username }).select('isAvatarImageSet')
  // if (user?.isAvatarImageSet) return res.status(200).json({ message: 'user has been set avator' })
  if (!AvatarImage) return res.status(400).json({ message: 'please applu a avator image' })
  await UserModal.findOneAndUpdate({ username }, { isAvatarImageSet: true, AvatarImage })
  return res.status(200).json({ message: 'set avator success' })

}
export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModal.find({ _id: { $ne: req.params.uid } }).select([
      'email',
      'username',
      'AvatarImage',
      '_id'
    ])
    res.status(200).json(users)
  } catch (err) { }
}



