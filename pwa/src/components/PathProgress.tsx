import React from 'react';
import { XIcon, NavigationIcon } from 'lucide-react';
export const PathProgress = ({ progress, destination, onCancel }) => {
  // Calculate estimated time based on progress
  const estimatedMinutes = Math.ceil((100 - progress) / 10);
  return (
    <div className="p-6 bg-blue-50 border-t border-blue-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center text-gray-900">
          <NavigationIcon size={24} className="mr-2 text-blue-600" />
          Navigation in Progress
        </h3>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
        >
          <XIcon size={20} className="text-gray-600" />
        </button>
      </div>
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2 font-medium">
          {estimatedMinutes} min remaining
        </div>
        <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="flex items-center bg-white p-3 rounded-lg">
        <div className="h-3 w-3 rounded-full bg-blue-600 mr-3"></div>
        <div className="text-gray-900 font-medium">
          {destination?.name || 'Your destination'}
        </div>
      </div>
    </div>
  );
};
