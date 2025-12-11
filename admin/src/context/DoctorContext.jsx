import { createContext } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";



export const DoctorContext  = createContext();

const DoctorContextProvider = (props) => {

    // Get backend URL with fallback for development
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 
                      (import.meta.env.DEV ? 'http://localhost:4000' : '');
    
    // Log backend URL for debugging (only in development)
    if (import.meta.env.DEV && !backendUrl) {
        console.warn('⚠️ VITE_BACKEND_URL not set, using fallback: http://localhost:4000');
    }
   
    const [dToken, setDtoken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');

    const[appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState([]);
    const [profileData, setProfileData] = useState(false);

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
      
        return age;
    }
    const getAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctors/appointments`, {
                headers: {
                    dToken,
                },
            });
            if(data.success){
                setAppointments(data.appointments.reverse()); 
                console.log(data.appointments);

            }else{
                toast.error(data.message);
            }
            

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctors/complete-appointment`,
                { appointmentId },
                {
                    headers: {
                        dToken,
                    },
                }
            );
    
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };


    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctors/cancel-appointment`,
                { appointmentId },
                {
                    headers: {
                        dToken,
                    },
                }
            );
    
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    

    const getDashData = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/doctors/dashboard`, {
                headers: {
                    dToken,
                }
            })
            if(data.success){
                setDashData(data.dashData);
                console.log(data.dashData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    
    const getProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctors/profile`, {
                headers: { dToken },
            });
            if (data.success) {
                setProfileData(data.profileData); // This will now work as expected
                console.log(data.profileData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    

    const value = {
        dToken,
        setDtoken,
        backendUrl,
        appointments,
        setAppointments,
        getAppointments,
        calculateAge,
        completeAppointment,
        cancelAppointment,
        getDashData,
        dashData,setDashData,
        getProfileData,
        profileData,setProfileData
    };
    return (
        <DoctorContext.Provider value={value}>
            {props.children }
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider 
