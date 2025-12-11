import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js"; 
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentsModel from "../models/appointmentModel.js";
import razorpay from "razorpay";




// API to Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check for missing fields
        if (!name || !email || !password) {
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
        

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
      

        // Create user data object
        const userData = {
            name,
            email,
            password: hashPassword
        };

      const newUser = new userModel(userData);
        const user = await newUser.save();
           

        
     

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);

        // Send success response
        res.json({ success: true, token });
       
       
       

    } catch (error) { 
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

//API for USer Login 

const loginUser = async (req, res) => {

    try {
        const{email, password} = req.body;

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({ success: false, message: "User not found" });
        }

  const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
            res.json({ success: true, token });
        }else{
            return res.json({ success: false, message: "Incorrect Credentials" });
        }


        
       

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
        
    }
}
//API to Get User Profile Data

const  getProfile = async (req, res) => {
    try {
        const{userId} = req.body;
        const userData = await userModel.findById(userId).select("-password");
       
        res.json({ success: true, userData });
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
        
    }
}

const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file; // Get the uploaded file
        
        // Check for missing fields
        if (!name || !phone || !address || !dob || !gender) {
            return res.json({ success: false, message: "Data missing" });
        }

        // Update user profile without the image first
        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender,
        });

        let imageUrl; // Define the variable to hold the image URL
        // Check if an image was uploaded
        if (imageFile) {
            // Upload image to Cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });
            imageUrl = imageUpload.secure_url; // Assign the secure URL to imageUrl
            // Update the user with the new image URL
            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.json({ success: true, message: "Profile updated successfully" });
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}


const bookAppoinment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        // Log received values to ensure they are coming through
        console.log("Received slotDate:", slotDate, "Received slotTime:", slotTime);

        const docData = await doctorModel.findById(docId).select("-password");

        // Check if doctor data and availability exist
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor not available" });
        }

        // Initialize slots_booked if undefined and check for slot availability
        let slots_booked = docData.slots_booked || {} ; // Ensure slots_booked is initialized as an object

        // Ensure slotTime is treated as a string
        const formattedSlotTime = String(slotTime).trim(); // Format the time correctly

        // Add slot to booked slots if it’s available
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(formattedSlotTime)) {
                return res.json({ success: false, message: "Slot already booked" });
            } else {
                slots_booked[slotDate].push(formattedSlotTime); // Add the new slotTime
            }
        } else {
            slots_booked[slotDate] = [formattedSlotTime]; // Create new array with the new slotTime
        }

        const userData = await userModel.findById(userId).select("-password");
        delete docData.slots_booked; // Remove slots_booked from docData

        const appointmentData = {
            userId,
            docId,
            docData,
            userData,
            amount: docData.fees,
            slotTime: formattedSlotTime,
            slotDate,
            date: Date.now(),
        };

        const newAppointment = new appointmentsModel(appointmentData);
        await newAppointment.save();

        // Update doctor data with the new booked slots
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment booked successfully" });
    } catch (error) {
        console.error("Error in book Appoinment:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to get user appointments for frontend my-appoinment page
const listAppointments = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentsModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


//Api to cancel appoinment
const cancelAppointment = async (req, res) => {
    try {
        const{
            userId,appointmentId} = req.body

        const appointmentData = await appointmentsModel.findById(appointmentId)

        if(appointmentData.
            userId !== 
            userId){
            return res.json({success:false,message:"Unauthorized user"})
        }else{
            await appointmentsModel.findByIdAndUpdate(appointmentId,{cancelled:true})
          //reliesing doctor slot 
const {docId,slotDate,slotTime} = appointmentData
const docData = await doctorModel.findById(docId)

let slots_booked = docData.slots_booked  ; // Ensure slots_booked is initialized as an object
 slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime)
 await doctorModel.findByIdAndUpdate(docId,{slots_booked})
            res.json({success:true,message:"Appointment cancelled"})

        }
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
        
    }
}


//API to make payment of appointment using razorpay



export { registerUser, loginUser, getProfile, updateProfile,bookAppoinment, listAppointments, cancelAppointment };
