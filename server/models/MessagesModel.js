import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    messageType:{
        type:String,
        enum:["text","file"],
        required:true
    },
    content: {
        type: String,
        required: function(){
            return this.messageType === "text";
        }
    },
    fileUrl :{
        type:String,
        required : function() {
            return this.messageType === "file"
        }
    },
    // chat: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Chat',
    //     required: true
    // },
    // readBy: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }]
}, {
    timestamps: {
        type:Date,
        default:Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;

