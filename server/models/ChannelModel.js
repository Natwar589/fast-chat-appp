import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  members:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true}],
  admin:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true}],
  messages: [{
    type:mongoose.Schema.ObjectId,ref: "Messages" , required:true
  }],
  updateAt:{
    type:Date,
    default:Date.now()
  }
  
});

channelSchema.pre("findOneAndUpdate",function(next){
    this.set({updateAt:Date.now()});
    next();
})
const Channel = mongoose.model("Channels",channelSchema);

export default Channel;