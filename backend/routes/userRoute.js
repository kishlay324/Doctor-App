import express from 'express';

import { getProfile, loginUser, registerUser, updateProfile,bookAppoinment,  listAppointments, cancelAppointment } from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';



const userRouter = express.Router();


userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile', authUser,getProfile);
userRouter.post('/update-profile', upload.single('image'),authUser,updateProfile);
userRouter.post('/book-appoinment', authUser,bookAppoinment);
userRouter.get('/appointments', authUser, listAppointments);
userRouter.post('/cancel-appointments', authUser, cancelAppointment);


export default userRouter