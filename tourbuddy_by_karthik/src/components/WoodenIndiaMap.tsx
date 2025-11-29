import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Info, ExternalLink, Eye } from 'lucide-react';
import cleanedPlacesData from '../data/cleaned/all_places_cleaned.json';

interface StateInfo {
  id: string;
  name: string;
  placeCount: number;
  description: string;
  topPlaces: string[];
  coordinates: { x: number; y: number; width: number; height: number };
}

export function WoodenIndiaMap() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Get state data from our CSV data
  const allPlaces = cleanedPlacesData;
  const stateCounts = allPlaces.reduce((acc, place) => {
    acc[place.stateCode] = (acc[place.stateCode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stateData: Record<string, StateInfo> = {};
  
  // Generate state information with coordinates for clickable regions
  Array.from(new Set(allPlaces.map(place => place.stateCode))).forEach(stateCode => {
    const stateName = allPlaces.find(place => place.stateCode === stateCode)?.state || stateCode;
    const placeCount = stateCounts[stateCode] || 0;
    const topPlaces = allPlaces
      .filter(place => place.stateCode === stateCode)
      .slice(0, 3)
      .map(place => place.place_name);

    const descriptions: Record<string, string> = {
      // ===== STATES OF INDIA (28) =====
      
      // Northern States
      'JK': 'Paradise on Earth, known for its stunning landscapes and rich culture',
      'HP': 'Dev Bhoomi - Land of Gods with stunning Himalayan landscapes',
      'PB': 'Land of Five Rivers, rich in history and culture',
      'HR': 'A state with rich agricultural and cultural heritage',
      'UK': 'Dev Bhoomi - Land of Gods with spiritual significance and natural beauty',
      'UP': 'Heart of India with ancient cities, monuments, and spiritual significance',
      
      // Western States
      'RJ': 'Land of kings with magnificent palaces, forts, and desert landscapes',
      'GJ': 'Land of vibrant culture, historical monuments, and diverse landscapes',
      'MH': 'Gateway to India with Bollywood, historical sites, and diverse landscapes',
      'GA': 'Beaches, Portuguese heritage, and vibrant nightlife',
      
      // Central States
      'MP': 'Heart of India with ancient temples, wildlife sanctuaries, and natural beauty',
      'CT': 'Land of dense forests, waterfalls, and rich tribal culture',
      
      // Eastern States
      'BR': 'Land of ancient history, religious significance, and cultural heritage',
      'JH': 'Land of waterfalls, forests, and rich mineral resources',
      'WB': 'Land of diverse landscapes, rich cultural heritage, and intellectual tradition',
      'OR': 'Land of ancient temples, beautiful beaches, and tribal culture',
      
      // Southern States
      'KA': 'Silicon Valley of India with ancient temples, hill stations, and coffee plantations',
      'TG': 'A state with rich history, cultural heritage, and modern development',
      'AP': 'Land of rich history, beautiful beaches, and diverse cultural heritage',
      'TN': 'Land of temples with Dravidian architecture and rich cultural heritage',
      'KL': 'God\'s Own Country - Backwaters, hill stations, and Ayurveda',
      
      // Northeastern States
      'AS': 'Gateway to Northeast India, known for tea plantations and wildlife',
      'AR': 'Land of the Dawn-Lit Mountains with pristine natural beauty',
      'NL': 'Land of Festivals, known for its rich tribal culture and natural beauty',
      'MN': 'Jewel of India, known for its natural beauty and cultural diversity',
      'ML': 'Abode of Clouds, famous for its waterfalls and living root bridges',
      'MZ': 'Land of the Hill People, known for its lush hills and vibrant culture',
      'TR': 'Land of temples, palaces, and rich cultural heritage',
      'SK': 'Himalayan state with stunning natural beauty and Buddhist culture',
      
      // ===== UNION TERRITORIES OF INDIA (8) =====
      
      'AN': 'Island paradise with pristine beaches and unique tribal culture',
      'CH': 'The City Beautiful, a well-planned city with modern architecture',
      'DN': 'Union Territory known for its natural beauty and cultural heritage',
      'DD': 'Union Territory with beautiful beaches and Portuguese colonial heritage',
      'DL': 'Capital city with rich history, monuments, and vibrant culture',
      'LA': 'High-altitude desert region with stunning landscapes and Buddhist culture',
      'LD': 'Coral islands with pristine beaches and marine life',
      'PY': 'Union Territory with beautiful beaches and French colonial heritage'
    };

    // Define clickable regions for each state (percentage-based coordinates)
    // Precisely mapped to match the political map image - All 28 States + 8 Union Territories
    const stateCoordinates: Record<string, { x: number; y: number; width: number; height: number }> = {
      // ===== STATES OF INDIA (28) =====
      
      // Northern States
      'JK': { x: 20, y: 5, width: 15, height: 18 },      // Jammu & Kashmir
      'HP': { x: 25, y: 15, width: 8, height: 12 },      // Himachal Pradesh
      'PB': { x: 22, y: 20, width: 10, height: 8 },     // Punjab
      'HR': { x: 28, y: 22, width: 6, height: 6 },      // Haryana
      'UK': { x: 32, y: 18, width: 6, height: 10 },     // Uttarakhand
      'UP': { x: 30, y: 28, width: 12, height: 18 },   // Uttar Pradesh
      
      // Western States
      'RJ': { x: 8, y: 25, width: 18, height: 20 },     // Rajasthan
      'GJ': { x: 3, y: 40, width: 15, height: 18 },    // Gujarat
      'MH': { x: 15, y: 45, width: 18, height: 22 },   // Maharashtra
      'GA': { x: 18, y: 65, width: 3, height: 4 },     // Goa
      
      // Central States
      'MP': { x: 22, y: 40, width: 15, height: 20 },   // Madhya Pradesh
      'CT': { x: 32, y: 45, width: 8, height: 12 },   // Chhattisgarh
      
      // Eastern States
      'BR': { x: 40, y: 30, width: 8, height: 10 },    // Bihar
      'JH': { x: 42, y: 40, width: 8, height: 10 },    // Jharkhand
      'WB': { x: 45, y: 32, width: 12, height: 15 },   // West Bengal
      'OR': { x: 44, y: 48, width: 10, height: 12 },  // Odisha
      
      // Southern States
      'KA': { x: 30, y: 65, width: 12, height: 15 },  // Karnataka
      'TG': { x: 35, y: 60, width: 6, height: 8 },    // Telangana
      'AP': { x: 40, y: 65, width: 8, height: 12 },   // Andhra Pradesh
      'TN': { x: 42, y: 75, width: 10, height: 15 },  // Tamil Nadu
      'KL': { x: 38, y: 85, width: 6, height: 8 },    // Kerala
      
      // Northeastern States
      'AS': { x: 55, y: 25, width: 12, height: 15 },  // Assam
      'AR': { x: 65, y: 15, width: 15, height: 20 }, // Arunachal Pradesh
      'NL': { x: 68, y: 28, width: 6, height: 8 },   // Nagaland
      'MN': { x: 70, y: 32, width: 6, height: 8 },   // Manipur
      'ML': { x: 62, y: 30, width: 6, height: 8 },   // Meghalaya
      'MZ': { x: 70, y: 38, width: 6, height: 8 },   // Mizoram
      'TR': { x: 72, y: 35, width: 4, height: 6 },   // Tripura
      'SK': { x: 58, y: 22, width: 4, height: 6 },   // Sikkim
      
      // ===== UNION TERRITORIES OF INDIA (8) =====
      
      // Union Territories
      'AN': { x: 75, y: 70, width: 12, height: 18 },  // Andaman & Nicobar Islands
      'CH': { x: 32, y: 22, width: 2, height: 2 },   // Chandigarh
      'DN': { x: 16, y: 62, width: 3, height: 4 },   // Dadra & Nagar Haveli
      'DD': { x: 14, y: 60, width: 2, height: 3 },   // Daman & Diu
      'DL': { x: 30, y: 25, width: 2, height: 2 },   // Delhi (NCT)
      'LA': { x: 15, y: 2, width: 12, height: 15 },  // Ladakh
      'LD': { x: 8, y: 80, width: 4, height: 6 },    // Lakshadweep
      'PY': { x: 44, y: 80, width: 3, height: 4 }     // Puducherry
    };

    stateData[stateCode] = {
      id: stateCode,
      name: stateName,
      placeCount,
      description: descriptions[stateCode] || `${stateName} - Explore the rich culture and heritage of this beautiful state`,
      topPlaces,
      coordinates: stateCoordinates[stateCode] || { x: 50, y: 50, width: 5, height: 5 }
    };
  });

  const handleStateClick = (stateCode: string) => {
    const state = stateData[stateCode];
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

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Check which state was clicked based on coordinates
    for (const [stateCode, state] of Object.entries(stateData)) {
      const coords = state.coordinates;
      if (x >= coords.x && x <= coords.x + coords.width && 
          y >= coords.y && y <= coords.y + coords.height) {
        handleStateClick(stateCode);
        break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive Political Map of India
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Click on any state to explore its amazing tourist destinations. 
            Discover {allPlaces.length} places across {Object.keys(stateData).length} states and union territories.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Map Container */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="relative max-w-4xl mx-auto">
              {/* Control Buttons */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200 hover:bg-white transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  {showLabels ? 'Hide' : 'Show'} Labels
                </button>
                <button
                  onClick={() => setSelectedState(null)}
                  className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200 hover:bg-white transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  Reset
                </button>
              </div>

              {/* Wooden Map Image with Clickable Overlay */}
              <div 
                ref={mapRef}
                className="relative cursor-pointer"
                onClick={handleMapClick}
              >
                <img
                  src="/indian-map.png"
                  alt="Interactive Political Map of India"
                  className="w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '900px', objectFit: 'contain', width: '100%' }}
                />
                
                {/* Clickable State Overlays */}
                {Object.entries(stateData).map(([stateCode, state]) => (
                  <div
                    key={stateCode}
                    className={`absolute cursor-pointer transition-all duration-200 ${
                      selectedState?.id === stateCode 
                        ? 'bg-blue-500/30 border-2 border-blue-600 shadow-lg' 
                        : hoveredState === stateCode 
                        ? 'bg-blue-400/20 border border-blue-500 shadow-md' 
                        : 'bg-transparent hover:bg-blue-300/10'
                    } rounded-lg`}
                    style={{
                      left: `${state.coordinates.x}%`,
                      top: `${state.coordinates.y}%`,
                      width: `${state.coordinates.width}%`,
                      height: `${state.coordinates.height}%`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStateClick(stateCode);
                    }}
                    onMouseEnter={() => handleStateHover(stateCode)}
                    onMouseLeave={handleStateLeave}
                    title={`Click to explore ${state.name} - ${state.placeCount} destinations`}
                  >
                    {/* State Label */}
                    {showLabels && (
                      <div 
                        className="absolute bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700 shadow-lg whitespace-nowrap z-10 border border-gray-200"
                        style={{
                          top: state.coordinates.height > 8 ? '-8px' : '-6px',
                          left: state.coordinates.width > 8 ? '50%' : '0',
                          transform: state.coordinates.width > 8 ? 'translateX(-50%)' : 'none',
                          // Special positioning for very small states
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
                    {hoveredState === stateCode && (
                      <div className="absolute inset-0 bg-blue-200/20 rounded-lg animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-8">
              {selectedState ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{selectedState.name}</h3>
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <p className="text-gray-600 mb-4">{selectedState.description}</p>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">Tourist Destinations</span>
                      <span className="text-lg font-bold text-blue-600">{selectedState.placeCount}</span>
                    </div>
                  </div>

                  {selectedState.topPlaces.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Places:</h4>
                      <ul className="space-y-1">
                        {selectedState.topPlaces.map((place, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {place}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => navigateToState(selectedState.id)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Explore {selectedState.placeCount} Places
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Interactive Political Map</h3>
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    Click on any state to explore its tourist destinations. 
                    Discover amazing places across India with detailed information.
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{allPlaces.length}</div>
                      <div className="text-sm text-blue-800">Total Destinations</div>
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-lg font-semibold text-indigo-600 mb-1">{Object.keys(stateData).length}</div>
                      <div className="text-sm text-indigo-800">States & Union Territories</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <p>💡 <strong>Tip:</strong> Click on any state to explore its destinations!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
