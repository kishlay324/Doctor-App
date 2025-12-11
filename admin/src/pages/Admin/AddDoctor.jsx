import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {

    const[docImg, setDocImg] = useState(false);
    const[name, setName] = useState('');
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
    const[experience,setExperience] = useState('1 year');
    const[fees,setFees] = useState('');
    const[about,setAbout] = useState('');
    const[speciality,setSpeciality] = useState('General Physician');
    const[degree,setDegree] = useState('');
    const[address1,setAddress1] = useState('');
    const[address2,setAddress2] = useState('');
    const{backendUrl, atoken} = useContext(AdminContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if(!docImg ){
                toast.error('Please add the image also')
            }

            const formData = new FormData();
            formData.append('image', docImg);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experience', experience);
            formData.append('fees', Number(fees));
            formData.append('about', about);
            formData.append('speciality', speciality);
            formData.append('degree', degree);
            formData.append('address1',JSON.stringify({line1:address1, line2:address2}));
            
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
                headers: {
                   atoken
                }
            })
            if(data.success){
                toast.success(data.message);
                setDocImg(null);
                setName('');
                setEmail('');
                setPassword('');
                setExperience('1 year');
                setFees('');
                setAbout('');
                setSpeciality('General physician');
                setDegree('');
                setAddress1('');
                setAddress2('');
            }
            else{
                toast.error(data.message);
            }
            
            
            
        } catch (error) {
            console.log(error);
        }

    }
  return (
    <form  onSubmit={onSubmitHandler} className='m-5 w-full max-h-[80vh] overflow-y-scroll bg-white px-8 py-8 border rounded max-w-4xl'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>

      <div className='flex items-center gap-4 mb-8 text-gray-500'>
        <label htmlFor="doc-img">
          <img className='w-16 h-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="Upload area" />
        </label>
        <input onChange={(e) => setDocImg(e.target.files[0])}  type="file" id="doc-img" hidden />
        <p>Upload doctor <br />picture</p>
      </div>

      <div className='flex flex-col gap-10 lg:flex-row items-start text-gray-600'>
        <div className='w-full lg:flex-1 flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <p>Your Name</p>
            <input onChange={(e) => setName(e.target.value)}  value={name} type="text" placeholder="Name" required className='w-full px-4 py-2 border rounded' />
          </div>

          <div className='flex flex-col gap-1'>
            <p>Your Email</p>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email" required className='w-full px-4 py-2 border rounded' />
          </div>

          <div className='flex flex-col gap-1'>
            <p>Doctor Password</p>
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required className='w-full px-4 py-2 border rounded' />
          </div>

          <div className='flex flex-col gap-1'>
            <p>Experience</p>
            <select onChange={(e) => setExperience(e.target.value)} value={experience} name="experience" required className='w-full px-4 py-2 border rounded'>
              <option value="" disabled selected>Select experience</option>
              <option value="1 year">1 Year</option>
              <option value="2 year">2 Years</option>
              <option value="3 year">3 Years</option>
              <option value="4 year">4 Years</option>
              <option value="5 year">5 Years</option>
              <option value="6 year">6 Years</option>
              <option value="7 year">7 Years</option>
              <option value="8 year">8 Years</option>
              <option value="9 year">9 Years</option>
              <option value="10 year">10 Years</option>
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <p>Fees</p>
            <input onChange={(e) => setFees(e.target.value)} value={fees} type="number" placeholder="Fees" required className='w-full px-4 py-2 border rounded' />
          </div>
        </div>

        <div className='w-full lg:flex-1 flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <p>Specialty</p>
            <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} name="specialty" required className='w-full px-4 py-2 border rounded'>
              <option value="" disabled selected>Select specialty</option>
              <option value="General physician">General Physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <p>Education</p>
            <input onChange={(e) => setDegree(e.target.value)} value={degree} type="text" placeholder="Education" required className='w-full px-4 py-2 border rounded' />
          </div>

          <div className='flex flex-col gap-1'>
            <p>Address</p>
            <input onChange={(e) => setAddress1(e.target.value)} value={address1} type="text" placeholder="Address 1" required className='w-full px-4 py-2 mb-2 border rounded' />
            <input onChange={(e) => setAddress2(e.target.value)} value={address2} type="text" placeholder="Address 2" required className='w-full px-4 py-2 border rounded' />
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <p>About Doctor</p>
        <textarea onChange={(e) => setAbout(e.target.value)} value={about} placeholder="Write About Doctor" rows={5} required className='w-full px-4 py-2 border rounded'></textarea>
      </div>

      <button type='submit' className='mt-4 px-10 py-3 text-white bg-primary rounded hover:bg-blue-600'>Add Doctor</button>
    </form>
  );
};

export default AddDoctor;
