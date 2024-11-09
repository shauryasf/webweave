import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VercelOAuth(){
    const BASE_URL = process.env.REACT_APP_BASE_URL
    // get the code from the url vercel sent to exchange for an access token
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const code = query.get('code');
    const navigate = useNavigate();
    // content to give status updates to the user
    const [content, setContent] = useState('Login in process...')

    useEffect(() => {
        const getAccessToken = async () => {
            // if code is invalid or null, redirect to dashboard
            if (code === null || code === undefined || code === ""){
                setContent("Invalid Code")
                setTimeout(() => navigate("/dashboard"), 2000)
                return;
            }
            // try to exchange the code for access token and save it in localstorage
            try {
                const response = await axios.get(`${BASE_URL}/auth/vercel_access_token?code=${code}`)
                setContent("Vercel login successful. Redirecting...")
                window.localStorage.setItem("webweave-vercel-token", response.data.access_token)
                setTimeout(() => navigate("/dashboard"), 2000)
            } catch {
            // if there is an error, redirect to /dashboard
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
