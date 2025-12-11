import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';

const Login = () => {
    const [state, setState] = useState('Admin');
    const { setAtoken,  backendUrl } = useContext(AdminContext);
    const  {setDtoken} = useContext(DoctorContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (state === 'Admin') {
                const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
                if (data.success) {
                    localStorage.setItem('atoken', data.token);
                    setAtoken(data.token);
                    toast.success("Admin login successful!");
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/doctors/login`, { email, password });
                if (data.success) {
                    localStorage.setItem('dToken', data.token);
                    setDtoken(data.token);
                    console.log(data.token);
                    toast.success("Doctor login successful!");
                   
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed. Please try again.");
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5e5e5e] text-sm shadow-lg">
                <p className="text-2xl font-semibold m-auto">
                    <span className="text-primary">{state}</span> Login
                </p>
                <div className="w-full">
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-[#dadada] rounded p-2 mt-1"
                        type="email"
                        required
                    />
                </div>
                <div className="w-full">
                    <p>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-[#dadada] rounded p-2 mt-1"
                        type="password"
                        required
                    />
                </div>
                <button className="bg-primary text-white w-full py-2 rounded-md text-base">Login</button>
                {state === "Admin" ? (
                    <p>
                        Doctor Login?{' '}
                        <span className="text-primary cursor-pointer underline" onClick={() => setState("Doctor")}>
                            Click Here
                        </span>
                    </p>
                ) : (
                    <p>
                        Admin Login?{' '}
                        <span className="text-primary cursor-pointer underline" onClick={() => setState("Admin")}>
                            Click Here
                        </span>
                    </p>
                )}
            </div>
        </form>
    );
};

export default Login;
