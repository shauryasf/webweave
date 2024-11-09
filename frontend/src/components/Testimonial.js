import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import builder from "../images/builder.png";

// Testimonial component to be shown on the auth page
const Testimonial = () => {
  return (
    <div className="flex flex-col items-center bg-[#026e53] text-white p-8 rounded-md shadow-lg w-100 h-100">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Design websites without code</h2>
      
      {/* Quote */}
      <p className="text-xl italic mb-4">
        Using WebWeave has made creating a website easier than ever. Just drag, drop, and publish!
      </p>

      <img src={builder} className="border-20"/>

      <div className="mt-6 bg-white text-black p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer">
        <div>
          <p className="font-bold">Create Your Website Now</p>
        </div>
        <div className="flex -space-x-2">
          <FaArrowRight />
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
