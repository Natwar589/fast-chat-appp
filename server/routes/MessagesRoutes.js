import express from "express";
import authenticateJWT from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import multer from "multer";

const messagesRoutes = express.Router();

// Get messages between two users
const upload = multer({dest:"uploads/files"});
messagesRoutes.get("/get-message", authenticateJWT, getMessages);
messagesRoutes.post('/uploadfile', authenticateJWT, upload.single("file"), uploadFile);

export default messagesRoutes;
