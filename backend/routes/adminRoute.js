import express from 'express';

import {addDoctor, adminDashboard, allDoctors, appointmentsAdmin, cancelAppointment, loginAdmin,} from '../controllers/adminController.js';

import upload from '../middleware/multer.js';
import authAdmin from '../middleware/authAdmin.js';
import { changeAvaiability } from '../controllers/doctorController.js';



const adminRouter = express.Router();

adminRouter.post('/add-doctor', authAdmin,upload.single('image'), addDoctor);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-doctors',authAdmin ,allDoctors);
adminRouter.post('/change-availability',authAdmin ,changeAvaiability);
adminRouter.get('/appointments',authAdmin ,appointmentsAdmin);
adminRouter.post('/cancel-appointment',authAdmin ,cancelAppointment);
adminRouter.get('/dashboard',authAdmin ,adminDashboard);






export default adminRouter;