import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const navigate = useNavigate();
    

    const [input, setInput]=useState('');
    const [searchResult,setSearchResult]=useState([]);
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');


<<<<<<< HEAD
    const url ='https://chatapplication-1-dqkc.onrender.com/api/auth'
=======
    const url = import.meta.env.backend_url;
>>>>>>> d37e5da (minor changes in frontend like adding .env file)

    useEffect(()=>{
        const loadUserFromToken = async () => {
            if (!token) return;

            try {
            const decoded = jwtDecode(token);
            const userId = decoded.id;

            const userRes = await axios.get(`${url}/api/auth/user/${userId}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            
            setUser(userRes.data);
            } catch (err) {
                console.error("Failed to load user from token:", err);
            }
        };

        loadUserFromToken();
    },[]);

    const register = async (userData)=>{
        setLoading(true);
        try {
            const response = await axios.post(`${url}/api/auth/register`, userData);
            console.log(response.data.user);
            
            // setUser(response.data.user);
            navigate('/login');
        } catch (err) {
            console.log(err.response?.data?.message || 'Registration failed');
        } finally {
        setLoading(false);
        }
    }

    const login = async (userData)=>{
        setLoading(true);
        try {
            const response =await axios.post(`${url}/api/auth/login`, userData);
            const {user, token } = response.data;
            localStorage.setItem('token',token);
            setUser(user);
            console.log(user);
            
            navigate('/');
        } catch (error) {
            console.log(error.response?.data?.message || 'Login failed');
        }finally {
            setLoading(false);
        }
    }

    const searchUser = async(query)=>{
        try {
            const response = await axios.get(`${url}/api/auth/search`,{
                headers:{
                    Authorization: `Bearer ${token}`,
                },
                params: {query}
            })
            setSearchResult(response.data);
        } catch (error) {
            console.log("Error in searching user: "+ error);
        }
    }

    const logout = ()=>{
        try{
            axios.post(`${url}/api/auth/logout`);
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        }
        catch (error) {
            console.log(error.response?.data?.message || 'Logout failed');
        }
    }


    return (
        <AuthContext.Provider value={{
            register,
            user,
            loading,
            login,
            logout,
            input,
            setInput,
            searchUser,
            searchResult
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
