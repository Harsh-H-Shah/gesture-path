import React, { useState } from 'react';
import {
  SearchIcon,
  MapPinIcon,
  BuildingIcon,
  CoffeeIcon,
  ShoppingBagIcon,
} from 'lucide-react';
// Mock location data
const popularLocations = [
  {
    id: 1,
    name: 'Food Court',
    category: 'food',
    lat: 40.7138,
    lng: -74.005,
  },
  {
    id: 2,
    name: 'Information Desk',
    category: 'info',
    lat: 40.7135,
    lng: -74.0065,
  },
  {
    id: 3,
    name: 'Restrooms',
    category: 'facilities',
    lat: 40.713,
    lng: -74.007,
  },
  {
    id: 4,
    name: 'North Entrance',
    category: 'entrance',
    lat: 40.7145,
    lng: -74.0055,
  },
  {
    id: 5,
    name: 'Electronics Store',
    category: 'shopping',
    lat: 40.7125,
    lng: -74.0045,
  },
];
export const SearchPanel = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    const results = popularLocations.filter(
      (location) =>
        location.name.toLowerCase().includes(query) ||
        location.category.includes(query)
    );
    setSearchResults(results);
  };
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food':
        return <CoffeeIcon size={18} />;
      case 'shopping':
        return <ShoppingBagIcon size={18} />;
      default:
        return <MapPinIcon size={18} />;
    }
  };
  return (
    <div className="p-2">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a location..."
            className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl text-lg text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </form>
      {searchResults.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            Search Results
          </h3>
          <ul className="space-y-2">
            {searchResults.map((location) => (
              <li
                key={location.id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200"
                onClick={() => onSearch(location)}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-3">
                    {getCategoryIcon(location.category)}
                  </div>
                  <span className="text-gray-900 font-medium">
                    {location.name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            Popular Destinations
          </h3>
          <ul className="space-y-2">
            {popularLocations.map((location) => (
              <li
                key={location.id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200"
                onClick={() => onSearch(location)}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-3">
                    {getCategoryIcon(location.category)}
                  </div>
                  <span className="text-gray-900 font-medium">
                    {location.name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
