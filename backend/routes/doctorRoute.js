import express from 'express';
import { appointmentCancelled, appointmentComplete, appointmentsDoctor, doctorList, doctorProfile, loginDoctor, updateDoctorProfile, doctorDashboard } from '../controllers/doctorController.js';
import doctorModel from '../models/doctorModel.js';
import authDoctor from '../middleware/authDoctor.js';





const doctorRouter = express.Router();


doctorRouter.get('/list',doctorList);
doctorRouter.get('/test', async (req, res) => {
  try {
    const db = doctorModel.db;
    const dbName = db.databaseName;
    const collectionName = doctorModel.collection.name;
    
    // Try multiple queries
    const countAll = await doctorModel.countDocuments({});
    const allDocs = await doctorModel.find({}).limit(5);
    const allDocsNoSelect = await doctorModel.find({}).limit(5);
    
    const collections = await db.listCollections().toArray();
    
    res.json({
      success: true,
      debug: {
        database: dbName,
        collection: collectionName,
        totalCount: countAll,
        sampleWithSelect: allDocs,
        sampleWithoutSelect: allDocsNoSelect,
        collectionsInDb: collections.map(c => c.name)
      }
    });
  } catch (error) {
    res.json({ success: false, error: error.message, stack: error.stack });
  }
});
doctorRouter.post('/login',loginDoctor);
doctorRouter.get('/appointments',authDoctor ,appointmentsDoctor);
doctorRouter.post('/complete-appointment',authDoctor ,appointmentComplete);
doctorRouter.post('/cancel-appointment',authDoctor ,appointmentCancelled);
doctorRouter.get('/dashboard',authDoctor ,doctorDashboard);
doctorRouter.get('/profile',authDoctor ,doctorProfile);
doctorRouter.post('/update-profile',authDoctor ,updateDoctorProfile);








export default doctorRouter;