import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentsModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";


const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file; // Get the uploaded file

    // Check if any required field is missing
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !imageFile) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Email is not valid" });
    }

    // Validate password length
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // Parse address if provided, else assign an empty object
    let parsedAddress;
    try {
      parsedAddress = address ? JSON.parse(address) : {};
    } catch (parseError) {
      return res.json({ success: false, message: "Invalid address format" });
    }

    // Hash the doctor's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.url;

    // Create new doctor data
    const doctorData = new doctorModel({
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress, // Use parsed address here
      date: Date.now(),
      image: imageUrl,
    });

    // Save doctor to the database
    await doctorData.save();
    res.json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


//api for the admin Login


const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
//     

   if(email== process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD){
    const token = jwt.sign( email + password , process.env.JWT_SECRET);
    res.json({ success: true,token });
     
     
   }else{
    res.json({ success: false, message: "Invalid email or password" });
   }
    
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// API to get all doctor list for admin panel

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentsModel.find({}).select("-password");
    res.json({ success: true, appointments });
    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }

}

const cancelAppointment = async (req, res) => {
  try {
      const{
          appointmentId} = req.body

      const appointmentData = await appointmentsModel.findById(appointmentId)

   
          await appointmentsModel.findByIdAndUpdate(appointmentId,{cancelled:true})
        //reliesing doctor slot 
const {docId,slotDate,slotTime} = appointmentData
const docData = await doctorModel.findById(docId)

let slots_booked = docData.slots_booked  ; // Ensure slots_booked is initialized as an object
slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime)
await doctorModel.findByIdAndUpdate(docId,{slots_booked})
          res.json({success:true,message:"Appointment cancelled"})

      
      
  } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
      
  }
}


const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentsModel.find({});
    const dashData = {
      doctors: doctors.length,
      patients: users.length,
      appointments: appointments.length,
      latestAppointments: appointments.reverse().slice(0,5),
    }
    res.json({ success: true, dashData });
    
    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin,cancelAppointment,adminDashboard };
