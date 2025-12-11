import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import RealatedDoctors from '../components/RealatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const navigate = useNavigate();
  const { docId } = useParams();
  const { doctors, currencySymbol, token, backendUrl, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState(null);

  const fetchdocInfo = async () => {
    if (!doctors || doctors.length === 0) {
      console.log('⚠️ No doctors available yet');
      return;
    }
    
    const doctInfo = doctors.find(doc => doc._id === docId);
    
    if (!doctInfo) {
      console.error('❌ Doctor not found with ID:', docId);
      toast.error('Doctor not found');
      navigate('/doctors');
      return;
    }
    
    // Ensure slots_booked exists as an object
    const docDataWithSlots = {
      ...doctInfo,
      slots_booked: doctInfo.slots_booked || {}
    };
    
    setDocInfo(docDataWithSlots);
    console.log('✅ Doctor info loaded:', docDataWithSlots);
  };

  const getAvailableSlots = async () => {
    // Guard clause: Don't proceed if docInfo is not loaded
    if (!docInfo) {
      console.log('⚠️ docInfo is not loaded yet');
      return;
    }

    setDocSlot([]);  // Reset the slots before fetching new ones
    const today = new Date();
  
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + i);
  
      // Set the start time to 10 AM and end time to 6 PM
      currentDate.setHours(10, 0, 0, 0);
      let endTime = new Date(currentDate);
      endTime.setHours(18, 0, 0, 0);
  
      let timeSlots = [];
  
      while (currentDate <= endTime) { // Allow slots up to and including 6 PM
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
          
        const slotDate = `${day}-${month}-${year}`;
        const slotTime = formattedTime;
  
        // Check if the slot is available - safely handle null/undefined slots_booked
        const slotsBooked = docInfo.slots_booked || {};
        const isSlotBooked = slotsBooked[slotDate] && slotsBooked[slotDate].includes(slotTime);
        const isSlotAvailable = !isSlotBooked;
  
        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }
  
        currentDate.setMinutes(currentDate.getMinutes() + 30); // Move to next slot in 30 min intervals
      }
      
      // Add the time slots for the current day to the state
      setDocSlot(prev => [...prev, timeSlots]);
    }
  };
  
  
  

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      toast.warn("Please select a time slot.");
      return;
    }

    // Safety check for docSlot
    if (!docSlot || docSlot.length === 0 || !docSlot[slotIndex] || docSlot[slotIndex].length === 0) {
      toast.error("No time slots available. Please refresh the page.");
      return;
    }

    try {
      const date = docSlot[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day}-${month}-${year}`;
      console.log("Slot Date:", slotDate);
      console.log("Slot Time:", slotTime);

      const { data } = await axios.post(`${backendUrl}/api/users/book-appoinment`, {
        docId,
        slotDate,
        slotTime
      }, {
        headers: {
          token
        }
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (doctors && doctors.length > 0) {
    fetchdocInfo();
    }
  }, [doctors, docId]);

  useEffect(() => {
    // Only call getAvailableSlots when docInfo is loaded
    if (docInfo) {
    getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlot);
  }, [docSlot]);

  return (
    <div>
      {/* Doctor details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo?.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* Doctor info: name, degree, experience */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo?.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo?.degree} - {docInfo?.speciality}</p>
            <button className='border border-gray-300 px-2 py-1 rounded-full'>{docInfo?.experience}</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo?.about}</p>
            <p className='font-medium text-gray-500 mt-4'>Appointment fees: {currencySymbol}{docInfo?.fees}</p>
          </div>
        </div>
      </div>

      {/* Booking slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlot.length > 0 && docSlot.map((item, index) => (
            <div
              key={index}
              onClick={() => { setSlotIndex(index); setSlotTime(null); }}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-300'}`}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className='flex item-center gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlot.length > 0 && docSlot[slotIndex].map((item, index) => (
            <p
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${slotTime === item.time ? 'bg-primary text-white' : 'border border-gray-300'}`}
              key={index}
              onClick={() => setSlotTime(item.time)}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
      </div>

      {/* Listing Related doctors */}
      <RealatedDoctors docId={docId} speciality={docInfo?.speciality}/>
    </div>
  );
}

export default Appointment;
