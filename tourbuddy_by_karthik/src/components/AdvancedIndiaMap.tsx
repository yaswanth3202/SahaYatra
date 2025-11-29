import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Info, ExternalLink, Search, Filter, Star, Users, Calendar, Camera } from 'lucide-react';
import cleanedPlacesData from '../data/cleaned/all_places_cleaned.json';
import missingStatesData from '../data/missingStatesData.json';
import { CompactWeatherWidget } from './WeatherWidget';

interface StateInfo {
  code: string;
  name: string;
  type: 'state' | 'union_territory';
  region: string;
  capital: string;
  description: string;
  highlights: string[];
  bestTime: string;
  coordinates: { x: number; y: number; width: number; height: number };
}

export function AdvancedIndiaMap() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [showLabels, setShowLabels] = useState(false);

  // Combine all places data
  const allPlaces = [...cleanedPlacesData, ...missingStatesData];

  // Function to get places count for a state
  const getPlacesCount = (stateCode: string) => {
    return allPlaces.filter(place => place.stateCode === stateCode).length;
  };

  // Complete data for all 28 states and 8 union territories
  const allStates: StateInfo[] = [
    // Northern States
    { code: 'JK', name: 'Jammu & Kashmir', type: 'union_territory', region: 'Northern', capital: 'Srinagar', description: 'Paradise on Earth with stunning landscapes and rich culture', highlights: ['Dal Lake', 'Gulmarg', 'Pahalgam', 'Sonamarg'], bestTime: 'April to October', coordinates: { x: 20, y: 5, width: 15, height: 18 } },
    { code: 'LA', name: 'Ladakh', type: 'union_territory', region: 'Northern', capital: 'Leh', description: 'High-altitude desert region with stunning landscapes and Buddhist culture', highlights: ['Pangong Lake', 'Nubra Valley', 'Leh Palace', 'Hemis Monastery'], bestTime: 'May to September', coordinates: { x: 15, y: 2, width: 12, height: 15 } },
    { code: 'HP', name: 'Himachal Pradesh', type: 'state', region: 'Northern', capital: 'Shimla', description: 'Dev Bhoomi - Land of Gods with stunning Himalayan landscapes', highlights: ['Shimla', 'Manali', 'Dharamshala', 'Spiti Valley'], bestTime: 'March to June, September to November', coordinates: { x: 25, y: 15, width: 8, height: 12 } },
    { code: 'PB', name: 'Punjab', type: 'state', region: 'Northern', capital: 'Chandigarh', description: 'Land of Five Rivers, rich in history and culture', highlights: ['Golden Temple', 'Jallianwala Bagh', 'Wagah Border', 'Anandpur Sahib'], bestTime: 'October to March', coordinates: { x: 22, y: 20, width: 10, height: 8 } },
    { code: 'HR', name: 'Haryana', type: 'state', region: 'Northern', capital: 'Chandigarh', description: 'Rich agricultural heritage and cultural diversity', highlights: ['Kurukshetra', 'Panipat', 'Sultanpur National Park', 'Pinjore Gardens'], bestTime: 'October to March', coordinates: { x: 28, y: 22, width: 6, height: 6 } },
    { code: 'UK', name: 'Uttarakhand', type: 'state', region: 'Northern', capital: 'Dehradun', description: 'Dev Bhoomi - Land of Gods with spiritual significance and natural beauty', highlights: ['Rishikesh', 'Haridwar', 'Nainital', 'Mussoorie'], bestTime: 'March to June, September to November', coordinates: { x: 32, y: 18, width: 6, height: 10 } },
    { code: 'UP', name: 'Uttar Pradesh', type: 'state', region: 'Northern', capital: 'Lucknow', description: 'Heart of India with ancient cities, monuments, and spiritual significance', highlights: ['Taj Mahal', 'Varanasi', 'Agra Fort', 'Fatehpur Sikri'], bestTime: 'October to March', coordinates: { x: 30, y: 28, width: 12, height: 18 } },
    { code: 'DL', name: 'Delhi', type: 'union_territory', region: 'Northern', capital: 'New Delhi', description: 'Capital city with rich history, monuments, and vibrant culture', highlights: ['Red Fort', 'India Gate', 'Qutub Minar', 'Lotus Temple'], bestTime: 'October to March', coordinates: { x: 30, y: 25, width: 2, height: 2 } },
    { code: 'CH', name: 'Chandigarh', type: 'union_territory', region: 'Northern', capital: 'Chandigarh', description: 'The City Beautiful, a well-planned city with modern architecture', highlights: ['Rock Garden', 'Sukhna Lake', 'Rose Garden', 'Capitol Complex'], bestTime: 'October to March', coordinates: { x: 32, y: 22, width: 2, height: 2 } },

    // Western States
    { code: 'RJ', name: 'Rajasthan', type: 'state', region: 'Western', capital: 'Jaipur', description: 'Land of kings with magnificent palaces, forts, and desert landscapes', highlights: ['Jaipur', 'Udaipur', 'Jaisalmer', 'Jodhpur'], bestTime: 'October to March', coordinates: { x: 8, y: 25, width: 18, height: 20 } },
    { code: 'GJ', name: 'Gujarat', type: 'state', region: 'Western', capital: 'Gandhinagar', description: 'Land of vibrant culture, historical monuments, and diverse landscapes', highlights: ['Ahmedabad', 'Vadodara', 'Surat', 'Dwarka'], bestTime: 'October to March', coordinates: { x: 3, y: 40, width: 15, height: 18 } },
    { code: 'MH', name: 'Maharashtra', type: 'state', region: 'Western', capital: 'Mumbai', description: 'Gateway to India with Bollywood, historical sites, and diverse landscapes', highlights: ['Mumbai', 'Pune', 'Aurangabad', 'Nashik'], bestTime: 'October to March', coordinates: { x: 15, y: 45, width: 18, height: 22 } },
    { code: 'GA', name: 'Goa', type: 'state', region: 'Western', capital: 'Panaji', description: 'Beaches, Portuguese heritage, and vibrant nightlife', highlights: ['Baga Beach', 'Old Goa', 'Dudhsagar Falls', 'Anjuna Beach'], bestTime: 'November to February', coordinates: { x: 18, y: 65, width: 3, height: 4 } },
    { code: 'DN', name: 'Dadra & Nagar Haveli', type: 'union_territory', region: 'Western', capital: 'Silvassa', description: 'Natural beauty and cultural heritage', highlights: ['Silvassa', 'Vapi', 'Daman', 'Naroli'], bestTime: 'October to March', coordinates: { x: 16, y: 62, width: 3, height: 4 } },
    { code: 'DD', name: 'Daman & Diu', type: 'union_territory', region: 'Western', capital: 'Daman', description: 'Beautiful beaches and Portuguese colonial heritage', highlights: ['Daman', 'Diu', 'Nagoa Beach', 'Fort of Moti Daman'], bestTime: 'October to March', coordinates: { x: 14, y: 60, width: 2, height: 3 } },

    // Central States
    { code: 'MP', name: 'Madhya Pradesh', type: 'state', region: 'Central', capital: 'Bhopal', description: 'Heart of India with ancient temples, wildlife sanctuaries, and natural beauty', highlights: ['Bhopal', 'Indore', 'Gwalior', 'Khajuraho'], bestTime: 'October to March', coordinates: { x: 22, y: 40, width: 15, height: 20 } },
    { code: 'CT', name: 'Chhattisgarh', type: 'state', region: 'Central', capital: 'Raipur', description: 'Land of dense forests, waterfalls, and rich tribal culture', highlights: ['Raipur', 'Bilaspur', 'Jagdalpur', 'Bastar'], bestTime: 'October to March', coordinates: { x: 32, y: 45, width: 8, height: 12 } },

    // Eastern States
    { code: 'BR', name: 'Bihar', type: 'state', region: 'Eastern', capital: 'Patna', description: 'Land of ancient history, religious significance, and cultural heritage', highlights: ['Patna', 'Bodh Gaya', 'Nalanda', 'Vaishali'], bestTime: 'October to March', coordinates: { x: 40, y: 30, width: 8, height: 10 } },
    { code: 'JH', name: 'Jharkhand', type: 'state', region: 'Eastern', capital: 'Ranchi', description: 'Land of waterfalls, forests, and rich mineral resources', highlights: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'], bestTime: 'October to March', coordinates: { x: 42, y: 40, width: 8, height: 10 } },
    { code: 'WB', name: 'West Bengal', type: 'state', region: 'Eastern', capital: 'Kolkata', description: 'Land of diverse landscapes, rich cultural heritage, and intellectual tradition', highlights: ['Kolkata', 'Darjeeling', 'Sundarbans', 'Shantiniketan'], bestTime: 'October to March', coordinates: { x: 45, y: 32, width: 12, height: 15 } },
    { code: 'OR', name: 'Odisha', type: 'state', region: 'Eastern', capital: 'Bhubaneswar', description: 'Land of ancient temples, beautiful beaches, and tribal culture', highlights: ['Bhubaneswar', 'Puri', 'Konark', 'Cuttack'], bestTime: 'October to March', coordinates: { x: 44, y: 48, width: 10, height: 12 } },

    // Southern States
    { code: 'KA', name: 'Karnataka', type: 'state', region: 'Southern', capital: 'Bangalore', description: 'Silicon Valley of India with ancient temples, hill stations, and coffee plantations', highlights: ['Bangalore', 'Mysore', 'Hampi', 'Coorg'], bestTime: 'October to February', coordinates: { x: 30, y: 65, width: 12, height: 15 } },
    { code: 'TG', name: 'Telangana', type: 'state', region: 'Southern', capital: 'Hyderabad', description: 'Rich history, cultural heritage, and modern development', highlights: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'], bestTime: 'October to March', coordinates: { x: 35, y: 60, width: 6, height: 8 } },
    { code: 'AP', name: 'Andhra Pradesh', type: 'state', region: 'Southern', capital: 'Amaravati', description: 'Land of rich history, beautiful beaches, and diverse cultural heritage', highlights: ['Visakhapatnam', 'Tirupati', 'Vijayawada', 'Guntur'], bestTime: 'October to March', coordinates: { x: 40, y: 65, width: 8, height: 12 } },
    { code: 'TN', name: 'Tamil Nadu', type: 'state', region: 'Southern', capital: 'Chennai', description: 'Land of temples with Dravidian architecture and rich cultural heritage', highlights: ['Chennai', 'Madurai', 'Coimbatore', 'Tiruchirappalli'], bestTime: 'October to March', coordinates: { x: 42, y: 75, width: 10, height: 15 } },
    { code: 'KL', name: 'Kerala', type: 'state', region: 'Southern', capital: 'Thiruvananthapuram', description: 'God\'s Own Country - Backwaters, hill stations, and Ayurveda', highlights: ['Kochi', 'Munnar', 'Alleppey', 'Thekkady'], bestTime: 'September to March', coordinates: { x: 38, y: 85, width: 6, height: 8 } },
    { code: 'PY', name: 'Puducherry', type: 'union_territory', region: 'Southern', capital: 'Puducherry', description: 'Beautiful beaches and French colonial heritage', highlights: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'], bestTime: 'October to March', coordinates: { x: 44, y: 80, width: 3, height: 4 } },

    // Northeastern States
    { code: 'AS', name: 'Assam', type: 'state', region: 'Northeastern', capital: 'Dispur', description: 'Gateway to Northeast India, known for tea plantations and wildlife', highlights: ['Guwahati', 'Kaziranga', 'Manas', 'Tezpur'], bestTime: 'October to April', coordinates: { x: 55, y: 25, width: 12, height: 15 } },
    { code: 'AR', name: 'Arunachal Pradesh', type: 'state', region: 'Northeastern', capital: 'Itanagar', description: 'Land of the Dawn-Lit Mountains with pristine natural beauty', highlights: ['Itanagar', 'Tawang', 'Ziro', 'Bomdila'], bestTime: 'October to April', coordinates: { x: 65, y: 15, width: 15, height: 20 } },
    { code: 'NL', name: 'Nagaland', type: 'state', region: 'Northeastern', capital: 'Kohima', description: 'Land of Festivals, known for its rich tribal culture and natural beauty', highlights: ['Kohima', 'Dimapur', 'Mokokchung', 'Wokha'], bestTime: 'October to May', coordinates: { x: 68, y: 28, width: 6, height: 8 } },
    { code: 'MN', name: 'Manipur', type: 'state', region: 'Northeastern', capital: 'Imphal', description: 'Jewel of India, known for its natural beauty and cultural diversity', highlights: ['Imphal', 'Loktak Lake', 'Ukhrul', 'Churachandpur'], bestTime: 'October to May', coordinates: { x: 70, y: 32, width: 6, height: 8 } },
    { code: 'ML', name: 'Meghalaya', type: 'state', region: 'Northeastern', capital: 'Shillong', description: 'Abode of Clouds, famous for its waterfalls and living root bridges', highlights: ['Shillong', 'Cherrapunji', 'Mawlynnong', 'Nongpoh'], bestTime: 'October to May', coordinates: { x: 62, y: 30, width: 6, height: 8 } },
    { code: 'MZ', name: 'Mizoram', type: 'state', region: 'Northeastern', capital: 'Aizawl', description: 'Land of the Hill People, known for its lush hills and vibrant culture', highlights: ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib'], bestTime: 'October to May', coordinates: { x: 70, y: 38, width: 6, height: 8 } },
    { code: 'TR', name: 'Tripura', type: 'state', region: 'Northeastern', capital: 'Agartala', description: 'Land of temples, palaces, and rich cultural heritage', highlights: ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar'], bestTime: 'October to May', coordinates: { x: 72, y: 35, width: 4, height: 6 } },
    { code: 'SK', name: 'Sikkim', type: 'state', region: 'Northeastern', capital: 'Gangtok', description: 'Himalayan state with stunning natural beauty and Buddhist culture', highlights: ['Gangtok', 'Pelling', 'Lachung', 'Namchi'], bestTime: 'March to June, September to December', coordinates: { x: 58, y: 22, width: 4, height: 6 } },

    // Union Territories - Islands
    { code: 'LD', name: 'Lakshadweep', type: 'union_territory', region: 'Islands', capital: 'Kavaratti', description: 'Coral islands with pristine beaches and marine life', highlights: ['Kavaratti', 'Agatti', 'Bangaram', 'Kadmat'], bestTime: 'October to March', coordinates: { x: 8, y: 80, width: 4, height: 6 } },
    { code: 'AN', name: 'Andaman & Nicobar Islands', type: 'union_territory', region: 'Islands', capital: 'Port Blair', description: 'Island paradise with pristine beaches and unique tribal culture', highlights: ['Port Blair', 'Havelock Island', 'Neil Island', 'Ross Island'], bestTime: 'October to May', coordinates: { x: 75, y: 70, width: 12, height: 18 } }
  ];

  const regions = ['all', 'Northern', 'Western', 'Central', 'Eastern', 'Southern', 'Northeastern', 'Islands'];

  const filteredStates = allStates.filter(state => {
    const matchesSearch = state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         state.capital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || state.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  const handleStateClick = (stateCode: string) => {
    const state = allStates.find(s => s.code === stateCode);
    if (state) {
      setSelectedState(state);
    }
  };

  const handleStateHover = (stateCode: string) => {
    setHoveredState(stateCode);
  };

  const handleStateLeave = () => {
    setHoveredState(null);
  };

  const navigateToState = (stateCode: string) => {
    navigate(`/places/state/${stateCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Explore Incredible India
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Discover the rich culture, heritage, and natural beauty of all 28 states and 8 union territories of India
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search states or capitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggle Labels */}
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              {showLabels ? 'Hide' : 'Show'} Labels
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Map Container */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="relative">
              <img
                src="/indian-map.png"
                alt="Interactive Political Map of India"
                className="w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '800px', objectFit: 'contain' }}
              />

              {/* Clickable State Overlays */}
              {allStates.map((state) => (
                <div
                  key={state.code}
                  className={`absolute cursor-pointer transition-all duration-300 ${
                    selectedState?.code === state.code 
                      ? 'bg-blue-500/40 border-2 border-blue-600 shadow-lg' 
                      : hoveredState === state.code 
                      ? 'bg-blue-400/30 border border-blue-500 shadow-md' 
                      : 'bg-transparent hover:bg-blue-300/20'
                  } rounded-lg`}
                  style={{
                    left: `${state.coordinates.x}%`,
                    top: `${state.coordinates.y}%`,
                    width: `${state.coordinates.width}%`,
                    height: `${state.coordinates.height}%`,
                  }}
                  onClick={() => handleStateClick(state.code)}
                  onMouseEnter={() => handleStateHover(state.code)}
                  onMouseLeave={handleStateLeave}
                  title={`${state.name} - ${state.capital}`}
                >
                  {/* State Label */}
                  {showLabels && (
                    <div 
                      className="absolute bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700 shadow-lg whitespace-nowrap z-10 border border-gray-200"
                      style={{
                        top: state.coordinates.height > 8 ? '-8px' : '-6px',
                        left: state.coordinates.width > 8 ? '50%' : '0',
                        transform: state.coordinates.width > 8 ? 'translateX(-50%)' : 'none',
                        ...(state.coordinates.width < 4 && {
                          top: '-10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '10px'
                        })
                      }}
                    >
                      {state.name}
                    </div>
                  )}
                  
                  {/* Hover indicator */}
                  {hoveredState === state.code && (
                    <div className="absolute inset-0 bg-blue-200/20 rounded-lg animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div className="w-full xl:w-96">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-8">
              {selectedState ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedState.name}</h3>
                      <p className="text-sm text-gray-500">{selectedState.capital} • {selectedState.region}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedState.type === 'state' ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">State</span>
                      ) : (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Union Territory</span>
                      )}
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{selectedState.description}</p>
                  
                  <div className="space-y-4">
                    {/* Places Count */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Available Places</h4>
                          <div className="text-2xl font-bold text-blue-600">{getPlacesCount(selectedState.code)}</div>
                        </div>
                        <MapPin className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>

                    {/* Weather Widget */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Weather</h4>
                      <CompactWeatherWidget location={selectedState.name} />
                    </div>

                    {/* Highlights */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Top Highlights
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedState.highlights.map((highlight, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Best Time to Visit */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-500" />
                        Best Time to Visit
                      </h4>
                      <p className="text-sm text-gray-600">{selectedState.bestTime}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => navigateToState(selectedState.code)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Explore {selectedState.name}
                      </button>
                      <button
                        onClick={() => setSelectedState(null)}
                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Interactive India Map</h3>
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Click on any state or union territory to explore its unique culture, history, and attractions.
                  </p>
                  
                  <div className="space-y-4">
                    {/* Statistics */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">28</div>
                          <div className="text-sm text-blue-800">States</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-indigo-600">8</div>
                          <div className="text-sm text-indigo-800">Union Territories</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Regions:</span>
                        <span className="font-medium">36</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Filtered Results:</span>
                        <span className="font-medium">{filteredStates.length}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <p>💡 <strong>Tip:</strong> Use the search and filter options to find specific states quickly!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* States Grid */}
        {filteredStates.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {filteredStates.length} {filterRegion === 'all' ? 'States & Union Territories' : `${filterRegion} States`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStates.map((state) => (
                <div
                  key={state.code}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleStateClick(state.code)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{state.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      state.type === 'state' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {state.type === 'state' ? 'State' : 'UT'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{state.capital}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{state.region}</p>
                    <p className="text-xs text-blue-600 font-medium">{getPlacesCount(state.code)} places</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
