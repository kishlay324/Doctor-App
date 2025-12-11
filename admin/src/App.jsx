import { useContext } from "react";
import "./App.css";
import Login from "./pages/Login";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointment from "./pages/Admin/AllAppointment";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import { DoctorContext } from "./context/DoctorContext";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

function App() {

  const {atoken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  return atoken || dToken? (
    <div className="bg-[#f8f9fd]">
     
      <ToastContainer/>
      <Navbar/>
      <div className="flex items-start">
        <Sidebar/>
        <Routes>

{/* admin Routes */}

         <Route path="/" element={<></>}/>
         <Route path="/admin-dashboard" element={<Dashboard/>}/>
         <Route path="/all-appointments" element={<AllAppointment/>}/>
         <Route path="/add-doctor" element={<AddDoctor/>}/>
         <Route path="/doctor-list" element={<DoctorsList/>}/>

         {/* doctor routes */}
         <Route path="/doctor-appointments" element={<DoctorAppointment/>}/>
         <Route path="/doctor-dashboard" element={<DoctorDashboard/>}/>
         <Route path="/doctor-profile" element={<DoctorProfile/>}/>


        </Routes>

      </div>

    </div>
  ):(
    <>
     <Login/>
    <ToastContainer/>
    </>
  )
  

}

export default App;
