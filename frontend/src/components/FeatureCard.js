import React from 'react';

const FeatureCard = ({icon, title, description}) => {
  return (
    <div className="group relative w-64 p-4 rounded-lg bg-[#162e26] text-white hover:border-green-400 border border-transparent transition-all duration-300 cursor-pointer flex flex-col items-start">
      <div className="flex items-center mb-2 pr-2 pl-2">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 pr-2 pl-2 pt-1 pb-1">{title}</h3>
      <p className="text-sm text-gray-300 text-left pr-2 pl-2 pt-1 pb-1">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
