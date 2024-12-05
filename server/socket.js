import { Server } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.ORIGIN, // Match the CORS origin with your client
            methods: ["GET", "POST"],
            credentials: true // Enable credentials
        }
    })

const userSocketMap = new Map();
const sendMessage = async (message)=>{
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient)

    const createdMessage = await Message.create(message);
    const messageData = await Message.findById(createdMessage._id)
    .populate("sender","id email firstName lastName image color")
    .populate("recipient","id email firstName lastName image color")

    if(recipientSocketId){
        io.to(recipientSocketId).emit("recieveMessage",messageData)
    }

    if(senderSocketId){
        io.to(senderSocketId).emit("recieveMessage", messageData)
    }

}
const sendChannelMessage = async (message) => {
    try {
        const { channelId, sender, content, messageType, fileUrl } = message;

        // Create a new message in the database
        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timeStamp: new Date(),
            fileUrl,
        });

        // Retrieve the created message with populated sender info
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image favColor")
            .exec();

        // Add the new message to the channel
        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id },
        });

        // Retrieve the channel object and ensure it has the admin field populated
        const channel = await Channel.findById(channelId)
            .populate("admin")  // Populate the admin field
            .exec();

        // Check if channel and admin are properly populated
        console.log("Channel object:", channel); // Log the channel to debug

        // Prepare the final message data to send to users
        const finalData = { ...messageData._doc, channel: channel._id };

        // Create a Set to track users who have received the message
        const notifiedUsers = new Set();

        // Send message to all channel members
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                if (member && member._id) {
                    const memberId = member._id.toString();
                    const memberSocketId = userSocketMap.get(memberId);
                    if (memberSocketId) {
                        io.to(memberSocketId).emit("recieveChannelMessage", finalData);
                        notifiedUsers.add(memberId);
                    }
                }
            });
        }

        // Send the message to the channel admin if they haven't already received it
        if (channel && channel.admin && Array.isArray(channel.admin) && channel.admin.length > 0) {
            const admin = channel.admin[0];  // Access the first admin in the array
            const adminId = admin._id.toString();
            if (!notifiedUsers.has(adminId)) {
                const adminSocketId = userSocketMap.get(adminId);
                if (adminSocketId) {
                    io.to(adminSocketId).emit("recieveChannelMessage", finalData);
                }
            }
        } else {
            console.log("No admin found for channel:", channelId);  // Debugging message if no admin
        }
    } catch (error) {
        console.error("Error sending channel message:", error);
        // Re-throw the error so it can be handled by the caller
        throw error;
    }
};


io.on("connection", (socket) => {
    console.log("Socket attempting connection...");
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap.set(userId, socket.id);
        console.log("User connected", userId, socket.id);
        
        // Acknowledge successful connection
        socket.emit("connected", {
            message: "Successfully connected to socket server"
        });
    }
    else {
        console.log("User not found", socket.id);
        // Disconnect socket if no userId
        socket.disconnect(true);
    }
    socket.on("sendMessage", sendMessage)
    socket.on("sendChannelMessage", sendChannelMessage)
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        for (const [key, value] of userSocketMap.entries()) {
            if (value === socket.id) {
                userSocketMap.delete(key);
                break;
            }
        }
    })
})
}

export default setupSocket;