import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (req, res) => {
    try {
        const { recipient } = req.query;
        if (!recipient) {
            return res.status(400).json({ error: "Recipient is required" });
        }

        // Find messages where the current user is either sender or recipient
        const messages = await Message.find({
            $or: [
                { sender: req.userId, recipient },
                { sender: recipient, recipient: req.userId }
            ]
        })
        .sort({ createdAt: 1 }) // Sort by createdAt ascending
        .lean();

        return res.status(200).json(messages);

    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const date = Date.now();
        let fileDir = `uploads/files/${date}`;
        let fileName = `${req.file.originalname}`;

        mkdirSync(fileDir, { recursive: true });

        let filePath = `${fileDir}/${fileName}`;
        renameSync(req.file.path, filePath);

        return res.status(200).json({
            message: "File uploaded successfully",
            file: {
                name: fileName,
                path: filePath
            }
        });

    } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
