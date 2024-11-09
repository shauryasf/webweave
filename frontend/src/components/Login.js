import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    // email and password to keep track of user's input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        // send request to backend and if it is success, save the auth token and email
        event.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
            window.localStorage.setItem("webweave-token", response.data.token);
            window.localStorage.setItem("webweave-email", email)
            navigate("/dashboard")
        } catch (error) {
            if (error.response){
                toast.error(error.response.data.error)
            } else {
                toast.error(error.message)
            }
        }
    };

    return (
        <div className="flex items-center justify-center text-white">
            <div className="bg-black/30 p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Login</h2>
                <form onSubmit={handleLogin} className="flex flex-col gap-7">
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 rounded bg-black/20 border border-gray-500 text-white focus:outline-none focus:border-green-500 w-full"
                            required
                        />
                        <label
                            className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none transition-all duration-200
                                ${email ? 'text-xs top-[-10px] left-0' : 'text-base top-1/2 left-2'}`}
                        >
                            Email
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 rounded bg-black/20 border border-gray-500 text-white focus:outline-none focus:border-green-500 w-full"
                            required
                        />
                        <label
                            className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none transition-all duration-200
                                ${password ? 'text-xs top-[-10px] left-0' : 'text-base top-1/2 left-2'}`}
                        >
                            Password
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 rounded bg-green-500 hover:bg-green-600 transition duration-300"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
}
