import React from 'react';
import { MapPinIcon, InfoIcon, HelpCircleIcon } from 'lucide-react';
import Logo from '../assets/Logo.png';
export const KioskHeader = () => {
  return (
    <header className="bg-white text-gray-900 p-2 shadow-md border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-3">
            <img src={Logo} alt="SmartWay Logo" className="h-8" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
            <InfoIcon size={24} className="text-gray-600" />
          </button>
          <button className="flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
            <HelpCircleIcon size={24} className="text-gray-600" />
          </button>
          <div className="text-xl font-medium bg-gray-100 px-5 py-3 rounded-xl">
            {new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
