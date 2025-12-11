import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className='px-4 md:px-10 py-10'>
      <div className='text-center text-2xl text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12 items-center'>
        <img className='w-full md:max-w-[360px] rounded-lg shadow-lg' src={assets.about_image} alt="Healthcare technology illustration" />
        
        <div className='flex-1'>
          <p className='text-gray-600 mb-4'>
            Welcome to DocSpot, your trusted partner in managing your healthcare needs conveniently and efficiently. At DocSpot, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
          </p>
          <p className='text-gray-600 mb-4'>
            DocSpot is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, DocSpot is here to support you every step of the way.
          </p>
          <b className='text-gray-800'>Our Vision</b>
          <p className='text-gray-600'>
            Our vision at DocSpot is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
          </p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>Why <span className='text-gray-700 font-semibold'>Choose Us</span></p>
      </div>


      <div className='flex flex-col md:flex-row mb-20'>

  
     <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>EFFICIENCY:</b>
        <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>

     </div>
     <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>

     <b>CONVENIENCE:</b>
        <p>Access to a network of trusted healthcare professionals in your area.</p>

     </div>
     <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>

     <b>PERSONALIZATION:</b>
        <p>Tailored recommendations and reminders to help you stay on top of your health.</p>

     </div>

      </div>
    </div>
  );
}

export default About;
