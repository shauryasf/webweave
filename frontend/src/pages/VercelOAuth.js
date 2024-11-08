import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VercelOAuth(){
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const code = query.get('code');
    const navigate = useNavigate();
    const [content, setContent] = useState('Login in process...')
    useEffect(() => {
        const getAccessToken = async () => {
            if (code === null || code === undefined || code === ""){
                setContent("Invalid Code")
                setTimeout(() => navigate("/dashboard"), 2000)
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/auth/vercel_access_token?code=${code}`)
                setContent("Vercel login successful. Redirecting...")
                window.localStorage.setItem("webweave-vercel-token", response.data.access_token)
                setTimeout(() => navigate("/dashboard"), 2000)
            } catch {
                setContent("Vercel login failed. Try again")
                setTimeout(() => navigate("/dashboard"), 2000)
                return;
            }
        }
        getAccessToken();
    }, [])
 
    return (
        <h1>{content}</h1>
    )
}

export default VercelOAuth;