import doctorModel from "../models/doctorModel.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentsModel from '../models/appointmentModel.js'


const changeAvaiability = async (req, res) => {
  try {
    const {docId}= req.body;
    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available
    })
    res.json({ success: true, message: "Availability changed successfully" })
  } catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
    
  }
}

const doctorList = async (req, res) => {
  try {
    // Debug: Check database connection
    const dbName = doctorModel.db.name;
    const collectionName = doctorModel.collection.name;
    console.log(`🔍 [${new Date().toISOString()}] Querying database: ${dbName}, collection: ${collectionName}`);
    
    // Try to get total count first
    const totalCount = await doctorModel.countDocuments({});
    console.log(`📊 Total doctors in database: ${totalCount}`);
    
    // Fetch doctors, excluding sensitive fields
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    console.log(`✅ Found ${doctors.length} doctors`);
    
    // If doctors array is empty but count > 0, try fetching without select to debug
    if (doctors.length === 0 && totalCount > 0) {
      console.log('⚠️  No doctors returned but database has documents. Checking without select...');
      const doctorsWithoutSelect = await doctorModel.find({}).limit(5);
      console.log(`📋 Found ${doctorsWithoutSelect.length} doctors without select (limited to 5)`);
      if (doctorsWithoutSelect.length > 0) {
        console.log('Sample doctor fields:', Object.keys(doctorsWithoutSelect[0].toObject()));
      }
    }
    
    // Always return success with doctors array (even if empty)
    res.json({ 
      success: true, 
      doctors: doctors || [],
      debug: { 
        dbName, 
        collectionName, 
        totalCount, 
        returned: doctors.length,
        timestamp: new Date().toISOString()
      } 
    });
  } catch (error) {
    console.error('❌ Error in doctorList:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Api for doctor Login

const loginDoctor = async (req, res) => {
  try {

    const{email,password} = req.body
    const doctor = await doctorModel.findOne({email})
    if(!doctor){
      return res.json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if(isMatch){
      const token = jwt.sign({id:doctor._id}, process.env.JWT_SECRET);
      res.json({ success: true, token });
    }else{
      return res.json({ success: false, message: "Incorrect Credentials" });
    }
      
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
    
  }
}

//Api for all appoinment for doctor Panel
const appointmentsDoctor = async (req, res) => {

try {

  const {docId} = req.body
  const appointments = await appointmentsModel.find({docId})
  res.json({ success: true, appointments })
  
} catch (error) {
  console.log(error);
  res.json({ success: false, message: error.message });
}

}
// Api to  mark  appoinment completed


const appointmentComplete = async (req, res) => {


try {
  const {docId, appointmentId} = req.body;
const appointmentData = await appointmentsModel.findById(appointmentId)
if(appointmentData && appointmentData.docId === docId){
  await appointmentsModel.findByIdAndUpdate(appointmentId, {isCompleted: true})
  return res.json({success: true, message: "Appointment marked as completed"})
}else{
  return res.json({success: false, message: "Unauthorized user"})
}
  
} catch (error) {
  console.log(error);
  res.json({ success: false, message: error.message });
}

}
// Api to  mark  appoinment completed
const appointmentCancelled = async (req, res) => {


  try {
    const {docId, appointmentId} = req.body;
  const appointmentData = await appointmentsModel.findById(appointmentId)
  if(appointmentData && appointmentData.docId === docId){
    await appointmentsModel.findByIdAndUpdate(appointmentId, {cancelled: true})
    return res.json({success: true, message: "Appointment cancelled"})
  }else{
    return res.json({success: false, message: "cancelation failed"})
  }
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
  
  }

  // api to get dashBoard data for doctor panel

  const doctorDashboard = async (req, res) => {
    try {
      const { docId } = req.body;
      const appointments = await appointmentsModel.find({ docId }); // Use `.find` to return an array
  
      let earning = 0;
      let patients = [];
  
      appointments.forEach((item) => {
        if (item.isCompleted || item.payment) {
          earning += item.amount;
        }
  
        if (!patients.includes(item.userId)) {
          patients.push(item.userId);
        }
      });
  
      const dashData = {
        earning,
        appointments: appointments.length,
        patients: patients.length,
        latestAppointments: appointments.slice(-5).reverse(), // Slice the last 5 and reverse
      };
  
      res.json({ success: true, dashData });
      console.log(dashData);
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
  };

  // Api to Get doctor profile for doctor panel

  const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body;
        const profileData = await doctorModel.findById(docId).select("-password");
        res.json({ success: true, profileData }); // Change ProfileData to profileData
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


  //
// Api to update the doctor profile data for doctor panel


const updateDoctorProfile = async (req, res) => {
 try {
  const { docId, fees, address,available } = req.body;
 
  await doctorModel.findByIdAndUpdate(docId, {
    fees, address,available
  });
  res.json({ success: true, message: "Profile updated successfully" });
 } catch (error) {
  console.log(error);
  res.json({ success: false, message: error.message });
  
 }
}
  

export{ changeAvaiability, doctorList, loginDoctor, appointmentsDoctor, appointmentCancelled, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile}