import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='px-4 md:px-10 py-10'>
      
      <div className='text-center text-2xl text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>
        

        <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
<img className='w-full md:max-w-[360px] rounded-lg shadow-lg' src= {assets.contact_image} alt="" />

<div className='flex
flex-col  justify-center items-start gap-6'>
  <p className='text-lg text-gray-600 font-semi
  '>OUR OFFICE</p>
  <p className='text-gray-500'>Deepak Kumar<br/>
  Mohali Punjab</p>
  <p className='text-gray-500'>Tel: 7018318078<br/>
  Email: deepakkumr2098@gmail.com, dk0133964@gmail.com</p>
  <p className='font-semibold text-lg text-gray-500'>CAREERS AT DOCSPOT</p>
  <p className='text-gray-500'>Learn more about our teams and job openings.</p>
  <button className='px-8 py-4  border border border-black hover:bg-black hover:text-white transition-all duration-300'>Explore Jobs</button>
</div>

        </div>


    </div>
  )
}

export default Contact