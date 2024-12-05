import Channel from '../models/ChannelModel.js';
import Message from '../models/MessagesModel.js';
import User from '../models/UserModel.js';

export const CreateChannel = async (req, res) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;
        const admin = await User.findById(userId);
        if (!admin) {
            return res.status(401).send("Admin user not found");
        }
        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
            return res.status(401).send("Some users are not valid users");
        }
        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });
        await newChannel.save();
        return res.status(201).json(newChannel);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error while creating channel");
    }
};

export const GetAllChannels = async (req, res) => {
    try {
        const userId = req.userId;
        const channels = await Channel.find({
            $or: [{ members: userId }, { admin: userId }]
        });
        return res.status(200).json(channels);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error while fetching channels");
    }
};

export const GetChannelMessages = async (req, res) => {
    try {
        const { channelId } = req.query;
        const userId = req.userId;

        // Verify channel exists and user is a member
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).send("Channel not found");
        }

        if (!channel.members.includes(userId) && !channel.admin.includes(userId)) {
            return res.status(403).send("Not authorized to view this channel's messages");
        }

        // Get messages from channel.messages array
        const messages = await Message.find({
            _id: { $in: channel.messages }
        })
        .populate('sender', 'firstName lastName email image')
        .sort({ createdAt: 1 });

        return res.status(200).json(messages);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Error while fetching channel messages");
    }
};


