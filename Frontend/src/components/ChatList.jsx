import React from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/authContext";

const ChatList = () => {
  const { chats,setSelectedUserId} = useChat();
  const { searchResult,input} = useAuth();


  const handleClick = async(receiver)=>{
      await setSelectedUserId(receiver._id);
      console.log(receiver);
      
  }
  

  return (
    <div className="flex flex-col gap-5 overflow-y-scroll w-[30%] bg-blue-200">
      {input.trim().length > 0 ? (
        searchResult.length === 0 ? (
          <p className="text-gray-600">No users found.</p>
        ) : (
          searchResult.map((user) => (
            <div key={user._id} className="flex gap-2 p-4 hover:bg-blue-400 cursor-pointer duration-75"
              onClick={()=>handleClick(user)}
            >
              {/* User Info: Get the other user (not current user) */}
              <img
                className="w-14 rounded-full"
                src="https://tse4.mm.bing.net/th/id/OIP.iM5v2LqxbonT3w1USmKPVgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="User"
              />
              <div className="flex flex-col justify-center">
                <p className="font-bold">
                  {/* You can replace this with actual user name */}
                  {user.name || "Unknown User"}
                </p>
              </div>
            </div>
          ))
        )
      ) : (
        chats.map((chat, idx) => (
          <div key={chat._id || idx} className={`flex gap-2 p-4 cursor-pointer hover:bg-blue-400 `} onClick={()=>handleClick(chat.participants[0])}>
            {/* User Info: Get the other user (not current user) */}
            <img
              className="w-14 rounded-full"
              src="https://tse4.mm.bing.net/th/id/OIP.iM5v2LqxbonT3w1USmKPVgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="User"
            />
            <div className="flex flex-col justify-center">
              <p className="font-bold">
                {/* You can replace this with actual user name */}
                {chat.participants[1]?.name || "Unknown User"}
              </p>
              <p className="font-semibold text-gray-600 text-sm">
                {/* Show last message if exists */}
                {chat.messages?.[chat.messages.length - 1]?.messages ||
                  "No messages yet"}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;
