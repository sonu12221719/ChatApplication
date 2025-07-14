import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { assets } from '../assets/assessts';
import { useAuth } from "./authContext";
const ChatContext = createContext();

export const useChat =()=> useContext(ChatContext);

export const ChatProvider = ({children})=>{
    const {user}=useAuth();
    
    const [chats,setChats]= useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput,setMessageInput] = useState('');
    const sendMessageaudio = new Audio(assets.sendedMessageAudio);
    const receiveMessageaudio = new Audio(assets.receivedMessageAudio);
    const [isOnline, setIsOnline] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);


    const url = 'http://localhost:3000';
    const token = localStorage.getItem('token');
    

    // Socket.io setup
    const socketRef = useRef();
    useEffect(() => {
        socketRef.current = io(url, {
            auth: { token },
        });
        if (user) {
            socketRef.current.emit('new-user-joined', user.name);
            setIsOnline(true);
        }
        socketRef.current.on('receive', (data) => {
            setMessages((prev) => [...prev, { messages: data.message, senderId: 'other', _id: Date.now() }]);
            receiveMessageaudio.play();
        });
        socketRef.current.on('user-joined', (name) => {
            if (user && name === user.name) setIsOnline(true);
        });
        socketRef.current.on('left', (name) => {
            if (user && name === user.name) setIsOnline(false);
        });
        socketRef.current.on('disconnect', () => {
            setIsOnline(false);
        });
        socketRef.current.on('online-users', (users) => {
            setOnlineUsers(users);
        });
        return () => {
            socketRef.current.disconnect();
        };
    }, [user]);


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
            await axios.post( `${url}/api/chat/send/${selectedUserId}`,
                {
                    message: messageInput,
                },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            // Emit socket event for real-time
            if (socketRef.current) {
                socketRef.current.emit('send', messageInput);
                sendMessageaudio.play();
            }
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
            setMessageInput,
            socket: socketRef.current,
            isOnline,
            onlineUsers
            }}>
            {children}
        </ChatContext.Provider>
    )
};