// src/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    // ... other validations (e.g., minlength, maxlength, regex)
  },
  password:{
    type:String,
    required:true,
    minLength:8
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // ... other validations (e.g., match for email format)
  },
  firstName: {
    type: String,
    default: '',
    // ... validations if needed
  },
  lastName: {
    type: String,
    default: '',
    // ... validations if needed
  },
  favoriteColor: {
    type: String,
    default: '#000000',
    // ... validations if needed (e.g., hex color format)
  },
  profileImage: {
    type: String,
    default: '',
    // ... validations if needed (e.g., URL format)
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
  // ... other fields (e.g., password, role)
}, { timestamps: true }); // Optional: Adds createdAt and updatedAt timestamps

// Create and export the User model using ES6 export
const User = mongoose.model('User', UserSchema);
export default User;
