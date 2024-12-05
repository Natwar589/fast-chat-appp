import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import path from 'path';
import cookieParser from "cookie-parser";
import mongoose from 'mongoose'
import authRoute from "./routes/AuthRoutes.js";
import createUploadDir from "./utils/createUploadDir.js";
import contactRoute from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from './routes/ChannelRoutes.js'
dotenv.config();
const app = express()
const port = process.env.PORT;
const databaseURL = process.env.DATABASE_URL;
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:[process.env.ORIGIN],
    methods:['GET','POST','PUT','PATCH','DELETE'],
    credentials:true,
}))
createUploadDir();
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per windowMs
//     message: 'Too many requests from this IP, please try again later.',
//   });
//   app.use(limiter);
app.use('/upload/files', express.static('uploads/files'))
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/auth',authRoute)
app.use('/api/contact',contactRoute)
app.use('/api/messages',messagesRoutes)
app.use('/api/channel',channelRoutes)

const server = app.listen(port,()=>{
    console.log(`Server is runing on http://localhost:${port}`)
})

setupSocket(server);

mongoose.connect(databaseURL)
  .then(() => console.log('DB connected Successfully'))
  .catch((err) => console.error(err));

