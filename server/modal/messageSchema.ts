import { Schema, model, connect, ObjectId } from 'mongoose';
export interface Message {
  message: string;
  users?: [];
  sender: ObjectId;
}
const messageSchema = new Schema<Message>(
  {
    message: {
      type: String,
      require: true
    },
    users: Array,
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true
    }
  },
  {
    timestamps: true
  }
)
const message = model<Message>('message', messageSchema)
export default message