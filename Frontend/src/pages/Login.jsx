import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const { setToken, token, backendUrl } = useContext(AppContext); 
  const navigate = useNavigate();
  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  // Check if user is already logged in on mount - only redirect if truly logged in
  useEffect(() => {
    const existingToken = localStorage.getItem('token');
    // Only redirect if there's a token AND we haven't just logged in
    if (existingToken && !justLoggedIn) {
      // Small delay to let context load
      const timer = setTimeout(() => {
        if (token) {
          navigate('/');
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, []); // Only run on mount

  // Navigate after successful login/signup
  useEffect(() => {
    // Only navigate if we just logged in (not on initial load)
    if (token && justLoggedIn) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 1500); // Give time to see success message
      return () => clearTimeout(timer);
    }
  }, [token, justLoggedIn, navigate]);

  // Reset form when switching between Sign Up and Login
  useEffect(() => {
    setEmail('');
    setPassword('');
    setName('');
    setIsSubmitting(false);
    setJustLoggedIn(false); // Reset login flag when switching
  }, [state]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/users/register`, {
          name,
          email,
          password,
        });
        if (data.success) {
          console.log('Registration successful:', data.token);
          localStorage.setItem('token', data.token);
          setToken(data.token); // set token in context
          setJustLoggedIn(true); // Mark that we just logged in
          toast.success('Account created successfully!');
        } else {
          toast.error(data.message);
          setIsSubmitting(false);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/users/login`, {
          email,
          password,
        });
        if (data.success) {
          console.log('Login successful:', data.token);
          localStorage.setItem('token', data.token);
          setToken(data.token);
          setJustLoggedIn(true); // Mark that we just logged in
          toast.success('Login successful!');
        } else {
          toast.error(data.message);
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.message || error.message || 'An error occurred');
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex flex-col items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-lg shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p className='text-gray-600'>Please {state === 'Sign Up' ? 'Sign Up' : 'Login'} to Book Appointment</p>
        
        {state === 'Sign Up' && (
          <div className='w-full max-w-sm'>
            <p className='text-sm'>Full Name</p>
            <input
              type="text"
              className='w-full p-2 border rounded-md'
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div className='w-full max-w-sm'>
          <p className='text-sm font-medium mb-1'>Email</p>
          <input
            type="email"
            className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className='w-full max-w-sm'>
          <p className='text-sm font-medium mb-1'>Password</p>
          <input
            type="password"
            className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            placeholder="Enter your password"
            minLength={8}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`flex bg-blue-500 text-white px-6 py-2 rounded-full items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {isSubmitting ? 'Please wait...' : (state === 'Sign Up' ? 'Sign Up' : 'Login')}
        </button>

        <p
          className='text-blue-600 cursor-pointer mt-4'
          onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
        >
          {state === 'Sign Up' ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </p>
      </div>
    </form>
  );
};

export default Login;
