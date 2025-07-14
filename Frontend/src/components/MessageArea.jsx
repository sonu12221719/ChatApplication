import React, { useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/authContext";

const MessageArea = () => {
  const { messages, sendMessage, messageInput, setMessageInput } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full px-10 h-full bg-white border-l border-gray-300">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {messages.length===0?(
          <div className="text-gray-500 text-center mt-10">Say hi 👋</div>
        ):(
        messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.senderId === user._id || msg.name === user?.name
                ? "bg-blue-400 text-white self-end"
                : "bg-gray-200 self-start"
            }`}
          >
            {msg.messages || msg.message}
          </div>
        )))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex items-center border-t border-gray-300 p-3">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg p-2 flex items-center justify-center"
          aria-label="Send Message"
          onClick={() => sendMessage()}
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageArea;
