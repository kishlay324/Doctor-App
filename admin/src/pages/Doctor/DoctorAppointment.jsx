import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const DoctorAppointment = () => {
  const { dToken, appointments, getAppointments, calculateAge,completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const {  currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-auto">
        {/* Header Row for larger screens */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Appointment Rows */}
        {appointments.map((item, index) => (
          <div
            key={index}
             className='flex flex-wrap justify-between max-sm:gap-5 sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col text-gray-600 py-3 px-6 border-b hover:bg-gray-50'
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img className="w-10 rounded-full" src={item.userData.image} alt="" />
              <p>{item.userData.name}</p>
            </div>
            <div className="text-xs inline border border-primary px-2 rounded-full">
              <p>{item.payment ? "Online" : "Cash"}</p>
            </div>
            <p className='text-xs inline border'>{calculateAge(item.userData.dob)}</p>
            <p>
              {item.slotDate}, {item.slotTime}
            </p>
            <p>{currency}{item.docData.fees}</p>

            {
  item.cancelled ? (
    <p className="text-red-500 text-xs font-medium">Cancelled</p>
  ) : item.isCompleted ? (
    <p className="text-green-500 text-xs font-medium">Completed</p>
  ) : (
    <div className="flex">
      <img
        onClick={() => cancelAppointment(item._id)}
        src={assets.cancel_icon}
        alt="Cancel"
        className="cursor-pointer w-10"
      />
      <img
        onClick={() => completeAppointment(item._id)}
        src={assets.tick_icon}
        alt="Confirm"
        className="cursor-pointer w-10"
      />
    </div>
  )
}

        
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointment;
