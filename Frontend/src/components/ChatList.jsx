import React from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/authContext";

const ChatList = () => {
  const { chats, setSelectedUserId, onlineUsers } = useChat();
  const { searchResult, input, user } = useAuth();

  // Helper to get the other participant (not the current user)
  const getOtherUser = (participants) => {
    if (!user || !participants) return null;
    return participants.find((u) => u._id !== user._id);
  };

  const handleClick = async (receiver) => {
    await setSelectedUserId(receiver._id);
    console.log(receiver);
  };

  return (
    <div className="flex flex-col gap-5 overflow-y-scroll w-[30%] bg-blue-200">
      {input.trim().length > 0 ? (
        searchResult.length === 0 ? (
          <p className="text-gray-600">No users found.</p>
        ) : (
          searchResult.map((user) => (
            <div
              key={user._id}
              className="flex gap-2 p-4 hover:bg-blue-400 cursor-pointer duration-75"
              onClick={() => handleClick(user)}
            >
              {/* User Info: Get the other user (not current user) */}
              <div className="relative">
                <img
                  className="w-14 rounded-full"
                  src="https://tse4.mm.bing.net/th/id/OIP.iM5v2LqxbonT3w1USmKPVgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                  alt="User"
                />
                {onlineUsers.includes(user.name) && (
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-bold">
                  {user.name || "Unknown User"}
                </p>
              </div>
            </div>
          ))
        )
      ) : (
        chats.map((chat, idx) => {
          const otherUser = getOtherUser(chat.participants);
          // Get last message text
          const lastMessage =
            chat.messages && chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1].messages
              : "No messages yet";
          return (
            <div
              key={chat._id || idx}
              className={`flex gap-2 p-4 cursor-pointer hover:bg-blue-400 `}
              onClick={() => otherUser && handleClick(otherUser)}
            >
              <div className="relative">
                <img
                  className="w-14 rounded-full"
                  src="https://tse4.mm.bing.net/th/id/OIP.iM5v2LqxbonT3w1USmKPVgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                  alt="User"
                />
                {otherUser && onlineUsers.includes(otherUser.name) && (
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-bold">
                  {otherUser?.name || "Unknown User"}
                </p>
                <p className="font-semibold text-gray-600 text-sm">
                  {lastMessage}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatList;
