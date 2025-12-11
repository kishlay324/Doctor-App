import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='mt-20 py-10 px-4 sm:px-10'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          <div className='col-span-1 md:col-span-2'>
            <div className='flex items-center gap-2 mb-4'>
              <img src="/docspot logo.png" alt="DocSpot Logo" className='h-10 md:h-12 w-auto' />
            </div>
            <p className='text-gray-600 text-sm mb-4'>
              Your trusted partner in managing healthcare needs. Book appointments with verified doctors and manage your health records conveniently.
            </p>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4 text-gray-800'>Quick Links</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link to='/' className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/doctors' className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to='/about' className='text-gray-600 hover:text-gray-900 transition-colors'>
                  About Us
                </Link>
              </li>
              <li>
                <Link to='/contact' className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4 text-gray-800'>Contact</h4>
            <ul className='space-y-2 text-sm text-gray-600'>
              <li>Email: deepakkumr2098@gmail.com</li>
              <li>Phone: 7018318078</li>
              <li>Location: Mohali, Punjab</li>
            </ul>
          </div>
        </div>
        <div className='border-t border-gray-300 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600'>
          <p>&copy; {new Date().getFullYear()} DocSpot. All rights reserved.</p>
          <div className='flex gap-4 mt-4 sm:mt-0'>
            <Link to='/about' className='hover:text-gray-900 transition-colors'>
              Privacy Policy
            </Link>
            <Link to='/contact' className='hover:text-gray-900 transition-colors'>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
