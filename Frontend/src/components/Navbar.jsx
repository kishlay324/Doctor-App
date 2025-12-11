import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const Navbar = () => {
  const { token, setToken, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className='flex items-center justify-between py-4 mb-4'>
      <Link to='/' className='flex items-center gap-2'>
        <img src="/docspot logo.png" alt='Logo' className='h-14 md:h-16' />
      </Link>
      <div className='hidden md:flex items-center gap-6'>
        <Link to='/' className='text-gray-600 hover:text-gray-900'>Home</Link>
        <Link to='/doctors' className='text-gray-600 hover:text-gray-900'>Doctors</Link>
        <Link to='/about' className='text-gray-600 hover:text-gray-900'>About</Link>
        <Link to='/contact' className='text-gray-600 hover:text-gray-900'>Contact</Link>
        {token ? (
          <div className='relative' ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className='flex items-center gap-2 focus:outline-none'
            >
              <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-primary transition-colors'>
                {userData?.image ? (
                  <img 
                    src={userData.image} 
                    alt="Profile" 
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <img 
                    src={assets.profile_pic} 
                    alt="Profile" 
                    className='w-full h-full object-cover'
                  />
                )}
              </div>
              {assets.dropdown_icon && (
                <img 
                  src={assets.dropdown_icon} 
                  alt="Dropdown" 
                  className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                />
              )}
            </button>
            {isProfileDropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'>
                <Link
                  to='/my-profile'
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className='block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors'
                >
                  My Profile
                </Link>
                <Link
                  to='/my-appointments'
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className='block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors'
                >
                  My Appointments
                </Link>
                <hr className='my-2 border-gray-200' />
                <button
                  onClick={handleLogout}
                  className='block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to='/login' className='bg-blue-500 text-white px-6 py-2 rounded-full'>Login</Link>
        )}
      </div>
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='md:hidden p-2'>
        {assets.menu_icon && <img src={assets.menu_icon} alt='Menu' className='w-6 h-6' />}
      </button>
      {isMenuOpen && (
        <div className='absolute top-16 left-0 right-0 bg-white border-t shadow-lg md:hidden z-50'>
          <div className='flex flex-col p-4 gap-4'>
            <Link to='/' onClick={() => setIsMenuOpen(false)} className='text-gray-600 hover:text-gray-900'>Home</Link>
            <Link to='/doctors' onClick={() => setIsMenuOpen(false)} className='text-gray-600 hover:text-gray-900'>Doctors</Link>
            <Link to='/about' onClick={() => setIsMenuOpen(false)} className='text-gray-600 hover:text-gray-900'>About</Link>
            <Link to='/contact' onClick={() => setIsMenuOpen(false)} className='text-gray-600 hover:text-gray-900'>Contact</Link>
            {token ? (
              <>
                <div className='flex items-center gap-3 py-2 border-t border-gray-200 pt-4'>
                  <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300'>
                    {userData?.image ? (
                      <img 
                        src={userData.image} 
                        alt="Profile" 
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <img 
                        src={assets.profile_pic} 
                        alt="Profile" 
                        className='w-full h-full object-cover'
                      />
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-semibold text-gray-800'>
                      {userData?.name || 'User'}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {userData?.email || ''}
                    </p>
                  </div>
                </div>
                <Link to='/my-profile' onClick={() => setIsMenuOpen(false)} className='text-gray-600 hover:text-gray-900'>My Profile</Link>
                <Link to='/my-appointments' onClick={() => setIsMenuOpen(false)} className='text-gray-600 hover:text-gray-900'>My Appointments</Link>
                <button onClick={handleLogout} className='text-left text-red-600 hover:text-red-700'>Logout</button>
              </>
            ) : (
              <Link to='/login' onClick={() => setIsMenuOpen(false)} className='bg-blue-500 text-white px-6 py-2 rounded-full text-center'>Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
