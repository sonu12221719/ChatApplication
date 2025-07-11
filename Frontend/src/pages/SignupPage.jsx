import React, { useState } from 'react'
import { assets } from '../assets/assessts'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const SignupPage = () => {
    const {register, loading} =useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e)=>{
        setFormData(prev=>({
            ...prev,
            [e.target.name]:e.target.value
        }));
    };

    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e)=>{
        e.preventDefault();

        if(formData.password !== formData.confirmPassword){
            setLocalError('Passwords do not match');
            return;
        }

        setLocalError('');
        const userDetails = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        }
        await register(userDetails);
    }
  return (
    <div className="relative h-screen w-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${assets.login_bg_image})` }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative bg-white bg-opacity-30 p-8 rounded-2xl shadow-xl w-full max-w-sm z-10">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">SignUp Page</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email:
            </label>
            <input
              type="text"
              id="email"
              name="email"
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
              Confirm Password:
            </label>
            <input
              type="confirmPassword"
              id="confirmPassword"
              name="confirmPassword"
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
             {localError && <p className="text-red-500 text-sm">{localError}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? 'Signing up...':'Sing Up'}
          </button>

        <div>
            <p className="mt-4 text-sm text-center text-white">
                Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
            </p>
        </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage