import React from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Header from '../components/Header';
import Testimonial from '../components/Testimonial';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
export default function AuthPage() {
    const navigate = useNavigate();
    useEffect(() => {
        const tempToken = window.localStorage.getItem("webweave-token");
        axios.get("http://localhost:5000/project/verify_token", {headers: {Authorization: "Bearer " + tempToken}})
        .then(res => navigate("/dashboard"))
        .catch(err => {})
    }, [])
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#024f3c_5%] to-[#141716_95%] text-white text-center">
            <Header />
            <div className="flex flex-col md:flex-row items-center justify-center h-[80dvh] p-10">
                <div className="w-full md:w-1/2">
                    <Login />
                </div>
                <div className="w-full md:w-1/2">
                    {/* <Signup /> */}
                    <Testimonial />
                </div>
            </div>
        </div>
    );
}
