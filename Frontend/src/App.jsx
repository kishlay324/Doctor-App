import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home.jsx';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import SymptomBot from './components/SymptomBot.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      {/* Wrap all routes inside a single <Routes> component */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
      </Routes>
      <Footer/>
      {/* AI Health Assistant Bot */}
      <SymptomBot />
    </div>
  );
}

export default App;
