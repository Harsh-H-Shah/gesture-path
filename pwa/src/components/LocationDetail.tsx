import React from 'react';
import { MapPinIcon, NavigationIcon, ClockIcon, InfoIcon } from 'lucide-react';
export const LocationDetail = ({
  location,
  onStartNavigation,
  isNavigating,
  onStopNavigation,
}) => {
  return (
    <div className="p-6 border-t border-gray-100">
      <div className="flex items-start mb-6">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-600 mr-4">
          <MapPinIcon size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{location.name}</h2>
          <p className="text-gray-600">
            {location.category?.charAt(0).toUpperCase() +
              location.category?.slice(1)}
          </p>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
          <ClockIcon size={20} className="text-gray-500 mr-3" />
          <span>Open: 9:00 AM - 9:00 PM</span>
        </div>
        <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
          <InfoIcon size={20} className="text-gray-500 mr-3" />
          <span>Level 2, Section B</span>
        </div>
      </div>
      {isNavigating ? (
        <button
          onClick={onStopNavigation}
          className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-lg font-medium flex items-center justify-center transition-colors duration-200 shadow-md"
        >
          <NavigationIcon size={24} className="mr-2" />
          Stop Navigation
        </button>
      ) : (
        <button
          onClick={() => onStartNavigation(location)}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-medium flex items-center justify-center transition-colors duration-200 shadow-md"
        >
          <NavigationIcon size={24} className="mr-2" />
          Navigate Here
        </button>
      )}
    </div>
  );
};
