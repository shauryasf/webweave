import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Header from '../components/Header';
import Testimonial from '../components/Testimonial';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AuthPage() {
    const BASE_URL = process.env.REACT_APP_BASE_URL
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Signup forms

    useEffect(() => {
        // verify the token, if it is valid, redirect to /dashboard as user is already logged in
        const tempToken = window.localStorage.getItem("webweave-token");
        axios.get(`${BASE_URL}/project/verify_token`, {
            headers: { Authorization: "Bearer " + tempToken }
        })
        .then(res => navigate("/dashboard"))
        .catch(err => {});
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#024f3c_5%] to-[#141716_95%] text-white text-center">
            <Header />
            <div className="flex flex-col md:flex-row items-center justify-center h-[80dvh] p-10">
                <div className="w-full md:w-1/2">
                    {isLogin ? <Login /> : <Signup />} {/* Conditionally render Login or Signup */}
                    <button
                        className="mt-4 text-green-400 hover:text-green-500"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "New to WebWeave? Sign up here" : "Already have an account? Log in here"}
                    </button>
                </div>
                <div className="w-full md:w-1/2">
                    <Testimonial />
                </div>
            </div>
        </div>
    );
}
