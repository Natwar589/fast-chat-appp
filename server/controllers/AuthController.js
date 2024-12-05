// src/controllers/userController.js

import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer'; // Import multer for error handling

// Define the secret key and token expiration time
const maxAge = 3 * 24 * 60 * 60; // Token expiration time (e.g., 3 days)

// Create the token function
const createToken = (email, username,userId) => {
  return jwt.sign(
    { email, username,userId }, // Payload to include in the token
    process.env.JWT_KEY, // Secret key to sign the token
    { expiresIn: maxAge } // Token expiration time
  );
};

// Controller to handle user-related logic
const userController = {
  // Create a new user (sign-up)
  createUser: async (req, res) => {
    const { username, email, password } = req.body; // Destructure only necessary properties

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email, and password are required' });
    }

    try {
      // Check if the email or username already exists
      const existingUser = await User.findOne({ email });
      const existingUsername = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
      if (existingUsername) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create a new user without image and color
      const newUser = new User({
        username,
        email,
        password: hashedPassword, // Store hashed password
        // image: undefined, // Not handling image during sign-up
        // color: undefined, // Not handling color during sign-up
        profileSetup: false, // Initialize profileSetup as false
      });

      await newUser.save(); // Save the user to the database

      // Generate a JWT token signed with email and username
      const token = createToken(newUser.email, newUser.username,newUser._id);

      // Send token in a cookie (httpOnly ensures it cannot be accessed via JavaScript)
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // Use secure cookies in production
        maxAge: maxAge * 1000, // Max age in milliseconds
        sameSite: 'None', // Helps mitigate CSRF attacks
      });

      res.status(201).json({ success: true, data: newUser, message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ success: false, message: 'Error creating user', error: error.message });
    }
  },

  // Login user
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
      // Check if the user exists
      const foundUser = await User.findOne({ email });
      if (!foundUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Check if the password matches
      const isPasswordValid = await bcrypt.compare(password, foundUser.password);
      if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // Generate a JWT token signed with email and username
      const token = createToken(foundUser.email, foundUser.username,foundUser._id);

      // Send token in a cookie (httpOnly ensures it cannot be accessed via JavaScript)
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // Use secure cookies in production
        maxAge: maxAge * 1000, // Max age in milliseconds
        sameSite: 'None', // Helps mitigate CSRF attacks
      });

      res.status(200).json({ success: true, data: foundUser, message: 'Login successful' });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
    }
  },

  // Update user profile
  updateUserProfile: async (req, res) => {
    try {
      // Retrieve user ID from authenticated session
      const userId = req.userId;

      // Extract fields from req.body
      const { firstName, lastName, favoriteColor } = req.body;
     if(!firstName || !lastName)
      return  res.status(404).json({ success: false, message: 'First and Lastname cannot be empty' });
      // Handle profileImage file
      let profileImagePath = undefined;
      if (req.file && req.file.filename) {
        profileImagePath = `/uploads/profileImages/${req.file.filename}`; // URL path to access the image
      }

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Update the user's profile fields
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.favoriteColor = favoriteColor || user.favoriteColor;
      if (profileImagePath) {
        user.profileImage = profileImagePath;
      }
      user.profileSetup = true; // Set profileSetup to true after profile setup

      // Save the updated user
      await user.save();

      // Respond with success and updated user data
      return res.status(200).json({ success: true, message: 'User profile updated', user });
    } catch (error) {
      console.error('Error updating profile:', error);

      // Handle Multer errors
      if (error instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: error.message });
      }

      // General server error
      return res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
    }
  },

  // Fetch user details
  getUserDetails: async (req, res) => {
    try {
      const userId = req.userId; // Retrieve user ID from authenticated session

      const user = await User.findById(Object(userId)).select('-password'); // Exclude password from the response
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error('Error fetching user details:', error);
      return res.status(500).json({ success: false, message: 'Error fetching user details', error: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      // Clear the authentication cookie
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
      // If you have set other cookies, clear them as well
      // res.clearCookie('refreshToken', { ...options });
  
      return res.status(200).json({ success: true, message: 'Successfully logged out' });
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(500).json({
        success: false,
        message: 'Error during logout',
        error: error.message,
      });
    }
  },
};

export default userController;
