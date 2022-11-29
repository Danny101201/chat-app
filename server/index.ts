import { connect } from 'mongoose';
import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import AuthRouter from './router/userRouter';
import MessageRouter from './router/messageRouter';
import connectDb from './db/connect'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { Server } from 'socket.io';

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json())
app.use('/api/auth', AuthRouter)
app.use('/api/message', MessageRouter)
// error handler
app.use((req, res, next) => {
    if (req.url.includes('/api')) {
        res.writeHead(200, { "Content-Type": "image/x-icon" });
        res.end();
    } else {
        const err = new Error('Not found');
        return res.status(500).json({
            errors: {
                message: err.message,
                error: err.name
            }
        })

    }
})
app.use((err: Error, req: Request, res: Response) => {
    console.log(err)
    // console.log(err.stack);
    // res.sendStatus(500)

})
// app.use(function (err, req, res, next) {
//     console.log(err.stack);
//     if (isProduction) {
//         res.sendStatus(err.status || 500)
//     } else {
//         res.status(err.status || 500);
//         res.json({
//             errors: {
//                 message: err.message,
//                 error: err
//             }
//         });
//     }
// });
const server = app.listen(process.env.PORT, async () => {
    await connectDb()
    console.log('server listening on port ' + process.env.PORT);
})
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});
const connectInfo = {
    onlineUsers: new Map(),
    chatSocket: undefined
} as { [key: string]: any }

io.on('connection', (socket) => {
    console.log('a user connected');
    connectInfo.chatSocket = socket
    socket.on('add-user', (userId) => {
        connectInfo.onlineUsers.set(userId, socket.id)
    });
    socket.on('send-message', (data) => {
        const sendUserSocket = connectInfo.onlineUsers.get(data.to)
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-recive', data.msg)
        }
    });
});