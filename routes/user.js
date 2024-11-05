import express from 'express';
import { hasPermission, isAuthenticated } from '../middlewares/auth';
import { getProfile, getUserProfile, registerUser, signInUser, updateProfile } from '../controllers/user';


const userRouter = express.Router();

//User Routes

userRouter.get('/users/me', isAuthenticated, hasPermission('get_profile'), getProfile);

userRouter.get('/users/me/dashboard', isAuthenticated, getUserProfile);

userRouter.patch('/users/me', isAuthenticated, hasPermission('update_profile'),updateProfile);

userRouter.post('/users/register', registerUser);

userRouter.post('/users/signIn', signInUser);