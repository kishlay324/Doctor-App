import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const updateUserProfileData = async () => {
    setLoading(true); // Set loading to true
    try {
      const formData = new FormData();
      if (image) formData.append('image', image);
      formData.append('name', userData.name);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('phone', userData.phone);
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);

      const { data } = await axios.post(`${backendUrl}/api/users/update-profile`, formData, {
        headers: {
          token,
        },
      });

      if (data.success) {
        toast.success(data.message);
        loadUserProfileData();
        setIsEdit(false);
        setImage(null); // Reset image after success
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return userData && (
    <div className='inline-block relative cursor-pointer'>
      {
        isEdit ? (
          <label htmlFor="image" className='cursor-pointer'>
            <div className='flex items-center gap-2'>
              <img className='w-36 rounded-full opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="Profile" />
              <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon}  />
            </div>
            <input onChange={(e) => {
              const file = e.target.files[0];
              // Check for file type and size (optional)
              if (file && (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024)) {
                setImage(file);
              } else {
                toast.error('Invalid file type or size. Please upload a valid image under 5MB.');
              }
            }} type="file" id='image' hidden />
          </label>
        ) : (
          <img className='w-36 rounded-full' src={userData.image} alt="Profile" />
        )
      }

      {
        isEdit ? (
          <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
        ) : (
          <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
        )
      }
      <hr className='bg-zinc-400 h-[1px] border-none' />

      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email:</p>
          <p className='text-blue-500'>{userData.email}</p>

          <p className='font-medium'>Phone:</p>
          {isEdit ? (
            <input className='bg-gray-100 max-w-52' type="text" onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
          ) : (
            <p className='text-blue-400'>{userData.phone}</p>
          )}

          <p className='font-medium'>Address:</p>
          {isEdit ? (
            <>
              <input className='bg-gray-50' type="text" onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} />
              <br />
              <input className='bg-gray-50' type="text" onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} />
            </>
          ) : (
            <p className='text-gray-500'>
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className='text-neutral-500 underline mt-3'>Basic Information</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {isEdit ? (
            <select className='bg-gray-50' onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className='text-blue-400'>{userData.gender}</p>
          )}

          <p className='font-medium'>Date of Birth:</p>
          {isEdit ? (
            <input className='bg-gray-50' type="date" onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
          ) : (
            <p className='text-gray-500 '>{userData.dob}</p>
          )}
        </div>

        <div>
          {isEdit ? (
            <button className='border border-primary px-8 py-2 rounded-full mt-5 hover:bg-primary transition-all duration-300' onClick={updateUserProfileData} disabled={loading}>
              {loading ? 'Saving...' : 'Save Information'}
            </button>
          ) : (
            <button className='border border-primary px-8 py-2 rounded-full mt-5 hover:bg-primary transition-all duration-300' onClick={() => setIsEdit(true)}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
