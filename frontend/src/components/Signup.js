import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/register', {email, password});
            window.localStorage.setItem("webweave-token", response.data.token)
            window.localStorage.setItem("webweave-email", email)
            navigate("/dashboard")
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center text-white">
            <div className="bg-black/30 p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 rounded bg-black/20 border border-gray-500 text-white focus:outline-none focus:border-green-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 rounded bg-black/20 border border-gray-500 text-white focus:outline-none focus:border-green-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 rounded bg-green-500 hover:bg-green-600 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}
