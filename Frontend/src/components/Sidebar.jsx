import React from 'react'
import { useAuth } from '../context/authContext';
import { TbLogout2 } from "react-icons/tb";


const Sidebar = () => {
    const {logout} = useAuth();
    const handleLogout = async () => {
        await logout();
    }
  return (
    <div className='w-16 h-screen bg-blue-500 p-4'>
        <TbLogout2 onClick={handleLogout} className="text-white mx-auto text-3xl cursor-pointer " />
    </div>
  )
}

export default Sidebar