import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext'; 
import { DoctorContext } from '../context/DoctorContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { atoken, setAtoken } = useContext(AdminContext);
    const { dToken, setDtoken } = useContext(DoctorContext);
    const navigate = useNavigate();

    const logout = () => {
        if (atoken) {
           atoken && setAtoken('');
            atoken && localStorage.removeItem('atoken');
        } else if (dToken) {
            dToken && setDtoken('');
           dToken && localStorage.removeItem('dtoken');
        }
        navigate('/');
    };

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
            {/* Logo with Click Navigation */}
            <div 
                onClick={() => navigate("/")}
                className='flex items-center gap-2 text-xs cursor-pointer'
            >
                <img 
                    className='w-36 sm:w-40' 
                    src={assets.admin_logo} 
                    alt="Admin Logo" 
                />
                <p className='border border-gray-600 px-2.5 py-0.5 rounded-full text-gray-600'>
                    {atoken ? "Admin" : dToken ? "Doctor" : ""}
                </p>
            </div>

            {/* Conditional Logout Button */}
            {(atoken || dToken) && (
                <button 
                    onClick={logout} 
                    className='bg-primary text-white text-sm px-10 py-2 rounded-full'
                >
                    Logout
                </button>
            )}
        </div>
    );
};

export default Navbar;
