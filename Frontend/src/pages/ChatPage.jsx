import React from 'react'
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ChatList from '../components/ChatList';
import MessageArea from '../components/MessageArea';

const ChatPage = () => {
    
  return (
    <>
    <div className='w-full h-screen flex'>
      <Sidebar/>
      <div className='w-full h-screen'>
        <Navbar/>
        <div className='flex h-[calc(100vh-4rem)]'>
          <ChatList/>
          <MessageArea/>
        </div>
      </div>
      
    </div>
    
    </>
  )
}

export default ChatPage