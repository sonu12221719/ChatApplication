import axios from "axios";
import { useContext,createContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";

const ChatContext = createContext();

export const useChat =()=> useContext(ChatContext);

export const ChatProvider = ({children})=>{
    const {user}=useAuth();
    
    const [chats,setChats]= useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput,setMessageInput] = useState('');


    const url = 'http://localhost:3000';
    const token = localStorage.getItem('token');
    

    useEffect(()=>{
        getAllChats();
    },[]);

    useEffect(()=>{
        if (!selectedUserId || !user) return;

        const getMessages = async ()=>{
            try {
                const response = await axios.get(`${url}/api/chat/get/${selectedUserId}`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });
                setMessages(response.data.messages);
                
            } catch (error) {
                console.log("Failed to load messages ", error);
                
            }
        }

        getMessages();
    },[selectedUserId, user])

    const getAllChats = async()=>{
        try {
            const response = await axios.get(`${url}/api/chat/get/all`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setChats(response.data);
            

        } catch (error) {
        console.error('Error fetching chats', error);
        }
    }

    const sendMessage = async()=>{
        try {
            const response = await axios.post( `${url}/api/chat/send/${selectedUserId}`,
                {
                    message: messageInput,
                },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            
            console.log(response);
            setMessageInput('');
            
        } catch (error) {
            console.log("Error in sending message.", error);
            
        }
        
    }

    return (
        <ChatContext.Provider value={{
            chats,
            setSelectedUserId,
            messages,
            sendMessage,
            messageInput,
            setMessageInput
            }}>
            {children}
        </ChatContext.Provider>
    )
};