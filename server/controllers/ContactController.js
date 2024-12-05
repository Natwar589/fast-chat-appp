import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    if (!searchTerm)
      return res.status(400).send("Serach Term is required");

    const sanitizedSearchTerm = searchTerm.replace(/[.**?^{}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contact = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ]
    })
    return res.status(200).json({ contact });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message,
    });
  }
}

export const getContactsForDMList = async (req, res) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);
    const contact = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        }
      },
      {
        $unwind: "$contactInfo"
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          favoriteColor: "$contactInfo.favoriteColor"
        }
      }
    ]);

    return res.status(200).json(contact);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message,
    });
  }
}

export const getAllContacts = async(req,res)=>{
  try {
    const users = await User.find({_id: {$ne: req.userId}},
      "firstName lastName _id email"
    );
    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      _id: user._id,
      email: user.email
    }));
    return res.status(200).json({contacts});
  } catch (error) {
    console.error("Error while fetching all the contacts", error);
    return res.status(500).send("Internal server error");
  }
}