import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  const scrollToSpeciality = () => {
    const specialitySection = document.getElementById('speciality');
    if (specialitySection) {
      specialitySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-blue-500 rounded-lg px-6 md:px-10 lg:px-20">
      {/* Left side of the header */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className="text-3xl font-bold md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight">
          Book Appointmnet With Trusted Doctors
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
          <img className="w-20" src={assets.group_profiles} alt="Group of profiles" />
          <p>
            Simply browse through our extensive list of trusted doctors, <br className="hidden sm:block" />
            schedule your appointment hassle-free.
          </p>
        </div>
        <button 
          onClick={scrollToSpeciality}
          className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300"
        >
          Book Appointment <img className="w-3" src={assets.arrow_icon} alt="Arrow icon" />
        </button>
      </div>

      {/* Right side of the header */}
      <div className="md:w-1/2 relative">
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
          src={assets.header_img}
          alt="Header illustration"
        />
      </div>
    </div>
  );
};

export default Header;