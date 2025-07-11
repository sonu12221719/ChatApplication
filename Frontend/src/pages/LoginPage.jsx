import React, { useState } from 'react';
import { assets } from '../assets/assessts';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const LoginPage = () => {
  const navigate = useNavigate();

  const {login,loading}= useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = async (e)=>{
    console.log(e.target.value);
    
    setFormData(prev=>({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    await login(formData);
    console.log(formData);
    
    navigate('/');
  }

  


  return (
    <div className="relative h-screen w-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${assets.login_bg_image})` }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative bg-white bg-opacity-30 p-8 rounded-2xl shadow-xl w-full max-w-sm z-10">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Login Page</h1>
        <form
        className="space-y-4"
        onSubmit={handleSubmit}
        >
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        <div>
            <p className="mt-4 text-sm text-center text-white">
                Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
            </p>
        </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
