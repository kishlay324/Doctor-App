import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";



export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [atoken, setAtoken] = useState(localStorage.getItem("atoken") ? localStorage.getItem("atoken") : "");
    const [doctors, setDoctors] = useState([]);
    const  [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);
    // Get backend URL with fallback for development
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 
                      (import.meta.env.DEV ? 'http://localhost:4000' : '');
    
    // Log backend URL for debugging (only in development)
    if (import.meta.env.DEV && !backendUrl) {
        console.warn('⚠️ VITE_BACKEND_URL not set, using fallback: http://localhost:4000');
    }

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/all-doctors`, {}, {
                headers: {
                    atoken
                }
            });

            if (data.success) {
                setDoctors(data.doctors);
                console.log(data.doctors);
            } else {
                toast.error(data.message); // Fixed: replaced `error.message` with `data.message`
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message); // Add a toast notification for error feedback
        }
    };

    const changeAvailability = async (docId) => { // Fixed spelling here
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { docId }, {
                headers: {
                    atoken
                }
            });

            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const getAllAppointments = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/admin/appointments`, {
                headers: {
                    atoken
                }
            }, {
                
            })

            if(data.success) {
                setAppointments(data.appointments);
                console.log(data.appointments);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }


    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, { appointmentId }, {
                headers: {
                    atoken
                }
            });

            if (data.success) {
                toast.success(data.message);
                getAllAppointments(); // Refresh appointments after cancel
            } else {
                toast.error(data.message);
            
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const getDashData = async () => {
        try {
             const {data} = await axios.get(`${backendUrl}/api/admin/dashboard`, {
                headers: {
                    atoken
                }
             })
             if (data.success){
                 setDashData(data.dashData);
                 console.log(data.dashData);
             }else{
                toast.error(data.message);
             }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            
        }
    }

    const value = {
        atoken, setAtoken, backendUrl, doctors, getAllDoctors, changeAvailability,
        appointments,setAppointments,getAllAppointments,cancelAppointment,
        dashData,getDashData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
