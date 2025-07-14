import React from "react";
import { IoSearch } from "react-icons/io5";
import { useAuth } from "../context/authContext";
import { useChat } from "../context/ChatContext";

const Navbar = () => {
  
  const {user,searchUser,input,setInput}=useAuth();
  const { isOnline } = useChat();


  const handleChange = async (e)=>{
    e.preventDefault();

    const value = e.target.value;
    console.log(value);
    setInput(value);

    if(value.trim()){
      await searchUser(value);
    }
  }

  return (
    <div className="flex justify-between w-full h-16 py-3 px-4 bg-blue-400">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Search..."
          className="max-w-2xl pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
      </div>

      <div className="flex items-center space-x-3">
        {/* Name and Online Status */}
        <div>
          <p className="font-bold items-end">{user?.name}</p>

          <div className="flex items-center space-x-2">
            {/* Status dot */}
            <span className={`w-3 h-3 rounded-full inline-block ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>

            <p className="text-sm text-gray-600">{isOnline ? 'online' : 'offline'}</p>
          </div>
        </div>

        {/* Profile Picture */}
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Sender Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default Navbar;
