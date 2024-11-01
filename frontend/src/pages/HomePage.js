import React, { useState } from 'react';
import builder from "../images/builder.png";
import Header from '../components/Header';

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#024f3c_5%] to-[#141716_95%] text-white text-center">
            <Header />
            <section className="flex flex-col justify-center h-[80dvh] p-5">
                <h1 className="text-4xl md:text-5xl mb-5 leading-relaxed">Build websites in minutes<br></br>without writing any code</h1>
                <p className="text-lg mb-8 text-gray-300 leading-relaxed">Discover WebWeave, the intuitive no-code website builder. Bid farewell to complex coding <br></br>and design hassle, and hello to seamless web creation.</p>
                <div className="flex flex-col md:flex-row gap-5 justify-center">
                    <a href="#" className="bg-green-500 text-white py-3 px-6 rounded hover:bg-green-600 transition duration-300">Start Building</a>
                    <a href="#" className="bg-gray-800 text-gray-300 py-3 px-6 rounded hover:bg-gray-600 transition duration-300">Try WebWeave</a>
                </div>
            </section>
            <section className="pl-40 pr-40 pt-20 pb-20">
                <img className="rounded-2xl shadow-md" src={builder} />
            </section>
            <section className="flex flex-col justify-center p-5">
                <h1 className="text-4xl md:text-5xl mb-5 leading-relaxed">Unleash your creativity<br></br>with our handy tools</h1>
                <p className="text-lg mb-8 text-gray-300 leading-relaxed">Explore over wide range of features that provides you full control <br></br>over your website's design and feasibility.</p>
            </section>
        </div>
    );
};

export default HomePage;
