import express from 'express';
import userController from '../controllers/AuthController.js';
import authenticateJWT from '../middlewares/AuthMiddleware.js';
import upload from '../middlewares/upladMiddleware.js';
// import requireAuth from '../middleware/authMiddleware.js';  // Import the middleware

const authRoute = express.Router();

// User routes
authRoute.post('/signup', userController.createUser);
authRoute.post('/login', userController.loginUser);

// Protected routes (only accessible with a valid token)
authRoute.post('/updateProfile', authenticateJWT, upload.single('profileImage'), userController.updateUserProfile);  // Require token for updating profile
authRoute.get('/userInfo', authenticateJWT, userController.getUserDetails); 
authRoute.post('/logout',userController.logout);      // Require token for getting user details

export default authRoute;
