import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Info, ExternalLink } from 'lucide-react';
import cleanedPlacesData from '../data/cleaned/all_places_cleaned.json';

interface StateInfo {
  id: string;
  name: string;
  placeCount: number;
  description: string;
  topPlaces: string[];
}

export function InteractiveIndiaSVGMap() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Get state data from our CSV data
  const allPlaces = cleanedPlacesData;
  const stateCounts = allPlaces.reduce((acc, place) => {
    acc[place.stateCode] = (acc[place.stateCode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stateData: Record<string, StateInfo> = {};
  
  // Generate state information
  Array.from(new Set(allPlaces.map(place => place.stateCode))).forEach(stateCode => {
    const stateName = allPlaces.find(place => place.stateCode === stateCode)?.state || stateCode;
    const placeCount = stateCounts[stateCode] || 0;
    const topPlaces = allPlaces
      .filter(place => place.stateCode === stateCode)
      .slice(0, 3)
      .map(place => place.place_name);

    const descriptions: Record<string, string> = {
      'GA': 'Beaches, Portuguese heritage, and vibrant nightlife',
      'RJ': 'Land of kings with magnificent palaces, forts, and desert landscapes',
      'KL': 'God\'s Own Country - Backwaters, hill stations, and Ayurveda',
      'DL': 'Capital city with rich history, monuments, and vibrant culture',
      'TN': 'Land of temples with Dravidian architecture and rich cultural heritage',
      'MH': 'Gateway to India with Bollywood, historical sites, and diverse landscapes',
      'WB': 'Land of diverse landscapes, rich cultural heritage, and intellectual tradition',
      'UP': 'Heart of India with ancient cities, monuments, and spiritual significance',
      'MP': 'Heart of India with ancient temples, wildlife sanctuaries, and natural beauty',
      'KA': 'Silicon Valley of India with ancient temples, hill stations, and coffee plantations',
      'AP': 'Land of rich history, beautiful beaches, and diverse cultural heritage',
      'TG': 'A state with rich history, cultural heritage, and modern development',
      'GJ': 'Land of vibrant culture, historical monuments, and diverse landscapes',
      'HR': 'A state with rich agricultural and cultural heritage',
      'PB': 'Land of Five Rivers, rich in history and culture',
      'HP': 'Dev Bhoomi - Land of Gods with stunning Himalayan landscapes',
      'UK': 'Dev Bhoomi - Land of Gods with spiritual significance and natural beauty',
      'AS': 'Gateway to Northeast India, known for tea plantations and wildlife',
      'MN': 'Jewel of India, known for its natural beauty and cultural diversity',
      'ML': 'Abode of Clouds, famous for its waterfalls and living root bridges',
      'MZ': 'Land of the Hill People, known for its lush hills and vibrant culture',
      'NL': 'Land of Festivals, known for its rich tribal culture and natural beauty',
      'AR': 'Land of the Dawn-Lit Mountains with pristine natural beauty',
      'SK': 'Himalayan state with stunning natural beauty and Buddhist culture',
      'TR': 'Land of temples, palaces, and rich cultural heritage',
      'OR': 'Land of ancient temples, beautiful beaches, and tribal culture',
      'JH': 'Land of waterfalls, forests, and rich mineral resources',
      'BR': 'Land of ancient history, religious significance, and cultural heritage',
      'CT': 'Land of dense forests, waterfalls, and rich tribal culture',
      'OD': 'Land of ancient temples, beautiful beaches, and tribal culture',
      'JK': 'Paradise on Earth, known for its stunning landscapes and rich culture',
      'LD': 'Coral islands with pristine beaches and marine life',
      'DN': 'Union Territory known for its natural beauty and cultural heritage',
      'CH': 'The City Beautiful, a well-planned city with modern architecture',
      'PY': 'Union Territory with beautiful beaches and French colonial heritage',
      'AN': 'Island paradise with pristine beaches and unique tribal culture'
    };

    stateData[stateCode] = {
      id: stateCode,
      name: stateName,
      placeCount,
      description: descriptions[stateCode] || `${stateName} - Explore the rich culture and heritage of this beautiful state`,
      topPlaces
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive India Tourism Map
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Click on any state to explore its amazing tourist destinations. 
            Discover {allPlaces.length} places across {Object.keys(stateData).length} states and union territories.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Map Container */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="relative">
              <svg 
                id="india-map" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 1000 1000" 
                role="img" 
                aria-label="India map with interactive states"
                className="w-full h-auto"
                style={{ maxHeight: '600px' }}
              >
                <defs>
                  <style>{`
                    .state {
                      fill: #e6eef6;
                      stroke: #2b4a63;
                      stroke-width: 0.8;
                      transition: fill 0.18s ease, filter 0.18s ease, transform 0.08s ease;
                      cursor: pointer;
                      filter: drop-shadow(0 0 0 rgba(0,0,0,0));
                      transform-origin: center;
                    }
                    .state:hover {
                      fill: #d1eaf8;
                      filter: drop-shadow(0 6px 12px rgba(31,120,180,0.12));
                      transform: translateY(-2px);
                    }
                    .state.selected {
                      fill: #1f78b4;
                      filter: drop-shadow(0 8px 16px rgba(31,120,180,0.2));
                    }
                    .state.pulse {
                      animation: pulse 0.7s ease-out;
                    }
                    @keyframes pulse {
                      0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(31,120,180,0)); }
                      50% { transform: scale(1.04); filter: drop-shadow(0 20px 30px rgba(31,120,180,0.12)); }
                      100% { transform: scale(1); filter: drop-shadow(0 6px 12px rgba(31,120,180,0.06)); }
                    }
                    .island {
                      fill: #e9f7ff;
                      stroke: #2b4a63;
                      stroke-width: 0.6;
                    }
                  `}</style>
                </defs>

                {/* Mainland States */}
                <g id="mainland">
                  {/* Uttar Pradesh */}
                  <path 
                    id="IN-UP" 
                    className={`state ${selectedState?.id === 'UP' ? 'selected' : ''} ${hoveredState === 'UP' ? 'pulse' : ''}`}
                    data-name="Uttar Pradesh"
                    d="M320 240 L420 240 L450 300 L420 350 L320 340 L300 300 Z"
                    onClick={() => handleStateClick('UP')}
                    onMouseEnter={() => handleStateHover('UP')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Maharashtra */}
                  <path 
                    id="IN-MH" 
                    className={`state ${selectedState?.id === 'MH' ? 'selected' : ''} ${hoveredState === 'MH' ? 'pulse' : ''}`}
                    data-name="Maharashtra"
                    d="M260 420 L360 430 L380 520 L320 540 L240 500 Z"
                    onClick={() => handleStateClick('MH')}
                    onMouseEnter={() => handleStateHover('MH')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Tamil Nadu */}
                  <path 
                    id="IN-TN" 
                    className={`state ${selectedState?.id === 'TN' ? 'selected' : ''} ${hoveredState === 'TN' ? 'pulse' : ''}`}
                    data-name="Tamil Nadu"
                    d="M520 720 L600 720 L620 820 L540 840 L500 800 Z"
                    onClick={() => handleStateClick('TN')}
                    onMouseEnter={() => handleStateHover('TN')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Rajasthan */}
                  <path 
                    id="IN-RJ" 
                    className={`state ${selectedState?.id === 'RJ' ? 'selected' : ''} ${hoveredState === 'RJ' ? 'pulse' : ''}`}
                    data-name="Rajasthan"
                    d="M200 300 L320 300 L340 400 L240 420 L180 350 Z"
                    onClick={() => handleStateClick('RJ')}
                    onMouseEnter={() => handleStateHover('RJ')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Kerala */}
                  <path 
                    id="IN-KL" 
                    className={`state ${selectedState?.id === 'KL' ? 'selected' : ''} ${hoveredState === 'KL' ? 'pulse' : ''}`}
                    data-name="Kerala"
                    d="M480 800 L520 800 L540 880 L500 900 L460 860 Z"
                    onClick={() => handleStateClick('KL')}
                    onMouseEnter={() => handleStateHover('KL')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Goa */}
                  <path 
                    id="IN-GA" 
                    className={`state ${selectedState?.id === 'GA' ? 'selected' : ''} ${hoveredState === 'GA' ? 'pulse' : ''}`}
                    data-name="Goa"
                    d="M280 600 L300 600 L300 620 L280 620 Z"
                    onClick={() => handleStateClick('GA')}
                    onMouseEnter={() => handleStateHover('GA')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Delhi */}
                  <path 
                    id="IN-DL" 
                    className={`state ${selectedState?.id === 'DL' ? 'selected' : ''} ${hoveredState === 'DL' ? 'pulse' : ''}`}
                    data-name="Delhi"
                    d="M350 250 L360 250 L360 260 L350 260 Z"
                    onClick={() => handleStateClick('DL')}
                    onMouseEnter={() => handleStateHover('DL')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Karnataka */}
                  <path 
                    id="IN-KA" 
                    className={`state ${selectedState?.id === 'KA' ? 'selected' : ''} ${hoveredState === 'KA' ? 'pulse' : ''}`}
                    data-name="Karnataka"
                    d="M380 600 L480 600 L500 700 L420 720 L360 650 Z"
                    onClick={() => handleStateClick('KA')}
                    onMouseEnter={() => handleStateHover('KA')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* West Bengal */}
                  <path 
                    id="IN-WB" 
                    className={`state ${selectedState?.id === 'WB' ? 'selected' : ''} ${hoveredState === 'WB' ? 'pulse' : ''}`}
                    data-name="West Bengal"
                    d="M500 300 L600 300 L620 400 L520 420 L480 350 Z"
                    onClick={() => handleStateClick('WB')}
                    onMouseEnter={() => handleStateHover('WB')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Gujarat */}
                  <path 
                    id="IN-GJ" 
                    className={`state ${selectedState?.id === 'GJ' ? 'selected' : ''} ${hoveredState === 'GJ' ? 'pulse' : ''}`}
                    data-name="Gujarat"
                    d="M120 400 L220 400 L240 500 L160 520 L100 450 Z"
                    onClick={() => handleStateClick('GJ')}
                    onMouseEnter={() => handleStateHover('GJ')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Madhya Pradesh */}
                  <path 
                    id="IN-MP" 
                    className={`state ${selectedState?.id === 'MP' ? 'selected' : ''} ${hoveredState === 'MP' ? 'pulse' : ''}`}
                    data-name="Madhya Pradesh"
                    d="M280 350 L380 350 L400 450 L320 470 L260 400 Z"
                    onClick={() => handleStateClick('MP')}
                    onMouseEnter={() => handleStateHover('MP')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Andhra Pradesh */}
                  <path 
                    id="IN-AP" 
                    className={`state ${selectedState?.id === 'AP' ? 'selected' : ''} ${hoveredState === 'AP' ? 'pulse' : ''}`}
                    data-name="Andhra Pradesh"
                    d="M420 600 L520 600 L540 700 L460 720 L400 650 Z"
                    onClick={() => handleStateClick('AP')}
                    onMouseEnter={() => handleStateHover('AP')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Telangana */}
                  <path 
                    id="IN-TG" 
                    className={`state ${selectedState?.id === 'TG' ? 'selected' : ''} ${hoveredState === 'TG' ? 'pulse' : ''}`}
                    data-name="Telangana"
                    d="M380 550 L420 550 L440 600 L400 620 L360 580 Z"
                    onClick={() => handleStateClick('TG')}
                    onMouseEnter={() => handleStateHover('TG')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Odisha */}
                  <path 
                    id="IN-OR" 
                    className={`state ${selectedState?.id === 'OR' ? 'selected' : ''} ${hoveredState === 'OR' ? 'pulse' : ''}`}
                    data-name="Odisha"
                    d="M480 450 L580 450 L600 550 L520 570 L460 500 Z"
                    onClick={() => handleStateClick('OR')}
                    onMouseEnter={() => handleStateHover('OR')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Bihar */}
                  <path 
                    id="IN-BR" 
                    className={`state ${selectedState?.id === 'BR' ? 'selected' : ''} ${hoveredState === 'BR' ? 'pulse' : ''}`}
                    data-name="Bihar"
                    d="M450 300 L550 300 L570 400 L490 420 L430 350 Z"
                    onClick={() => handleStateClick('BR')}
                    onMouseEnter={() => handleStateHover('BR')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Jharkhand */}
                  <path 
                    id="IN-JH" 
                    className={`state ${selectedState?.id === 'JH' ? 'selected' : ''} ${hoveredState === 'JH' ? 'pulse' : ''}`}
                    data-name="Jharkhand"
                    d="M480 350 L580 350 L600 450 L520 470 L460 400 Z"
                    onClick={() => handleStateClick('JH')}
                    onMouseEnter={() => handleStateHover('JH')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Chhattisgarh */}
                  <path 
                    id="IN-CT" 
                    className={`state ${selectedState?.id === 'CT' ? 'selected' : ''} ${hoveredState === 'CT' ? 'pulse' : ''}`}
                    data-name="Chhattisgarh"
                    d="M380 450 L480 450 L500 550 L420 570 L360 500 Z"
                    onClick={() => handleStateClick('CT')}
                    onMouseEnter={() => handleStateHover('CT')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Punjab */}
                  <path 
                    id="IN-PB" 
                    className={`state ${selectedState?.id === 'PB' ? 'selected' : ''} ${hoveredState === 'PB' ? 'pulse' : ''}`}
                    data-name="Punjab"
                    d="M280 200 L380 200 L400 300 L320 320 L260 250 Z"
                    onClick={() => handleStateClick('PB')}
                    onMouseEnter={() => handleStateHover('PB')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Haryana */}
                  <path 
                    id="IN-HR" 
                    className={`state ${selectedState?.id === 'HR' ? 'selected' : ''} ${hoveredState === 'HR' ? 'pulse' : ''}`}
                    data-name="Haryana"
                    d="M320 220 L380 220 L400 280 L340 300 L300 250 Z"
                    onClick={() => handleStateClick('HR')}
                    onMouseEnter={() => handleStateHover('HR')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Himachal Pradesh */}
                  <path 
                    id="IN-HP" 
                    className={`state ${selectedState?.id === 'HP' ? 'selected' : ''} ${hoveredState === 'HP' ? 'pulse' : ''}`}
                    data-name="Himachal Pradesh"
                    d="M300 150 L380 150 L400 200 L320 220 L280 170 Z"
                    onClick={() => handleStateClick('HP')}
                    onMouseEnter={() => handleStateHover('HP')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Uttarakhand */}
                  <path 
                    id="IN-UK" 
                    className={`state ${selectedState?.id === 'UK' ? 'selected' : ''} ${hoveredState === 'UK' ? 'pulse' : ''}`}
                    data-name="Uttarakhand"
                    d="M380 180 L420 180 L440 250 L400 270 L360 220 Z"
                    onClick={() => handleStateClick('UK')}
                    onMouseEnter={() => handleStateHover('UK')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Jammu and Kashmir */}
                  <path 
                    id="IN-JK" 
                    className={`state ${selectedState?.id === 'JK' ? 'selected' : ''} ${hoveredState === 'JK' ? 'pulse' : ''}`}
                    data-name="Jammu and Kashmir"
                    d="M280 80 L380 80 L400 150 L320 170 L260 120 Z"
                    onClick={() => handleStateClick('JK')}
                    onMouseEnter={() => handleStateHover('JK')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Assam */}
                  <path 
                    id="IN-AS" 
                    className={`state ${selectedState?.id === 'AS' ? 'selected' : ''} ${hoveredState === 'AS' ? 'pulse' : ''}`}
                    data-name="Assam"
                    d="M600 250 L700 250 L720 350 L620 370 L580 300 Z"
                    onClick={() => handleStateClick('AS')}
                    onMouseEnter={() => handleStateHover('AS')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Manipur */}
                  <path 
                    id="IN-MN" 
                    className={`state ${selectedState?.id === 'MN' ? 'selected' : ''} ${hoveredState === 'MN' ? 'pulse' : ''}`}
                    data-name="Manipur"
                    d="M700 350 L750 350 L760 400 L710 410 L690 380 Z"
                    onClick={() => handleStateClick('MN')}
                    onMouseEnter={() => handleStateHover('MN')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Meghalaya */}
                  <path 
                    id="IN-ML" 
                    className={`state ${selectedState?.id === 'ML' ? 'selected' : ''} ${hoveredState === 'ML' ? 'pulse' : ''}`}
                    data-name="Meghalaya"
                    d="M650 300 L700 300 L710 350 L660 360 L640 330 Z"
                    onClick={() => handleStateClick('ML')}
                    onMouseEnter={() => handleStateHover('ML')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Mizoram */}
                  <path 
                    id="IN-MZ" 
                    className={`state ${selectedState?.id === 'MZ' ? 'selected' : ''} ${hoveredState === 'MZ' ? 'pulse' : ''}`}
                    data-name="Mizoram"
                    d="M700 400 L750 400 L760 450 L710 460 L690 430 Z"
                    onClick={() => handleStateClick('MZ')}
                    onMouseEnter={() => handleStateHover('MZ')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Nagaland */}
                  <path 
                    id="IN-NL" 
                    className={`state ${selectedState?.id === 'NL' ? 'selected' : ''} ${hoveredState === 'NL' ? 'pulse' : ''}`}
                    data-name="Nagaland"
                    d="M700 300 L750 300 L760 350 L710 360 L690 330 Z"
                    onClick={() => handleStateClick('NL')}
                    onMouseEnter={() => handleStateHover('NL')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Arunachal Pradesh */}
                  <path 
                    id="IN-AR" 
                    className={`state ${selectedState?.id === 'AR' ? 'selected' : ''} ${hoveredState === 'AR' ? 'pulse' : ''}`}
                    data-name="Arunachal Pradesh"
                    d="M700 200 L800 200 L820 300 L720 320 L680 250 Z"
                    onClick={() => handleStateClick('AR')}
                    onMouseEnter={() => handleStateHover('AR')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Sikkim */}
                  <path 
                    id="IN-SK" 
                    className={`state ${selectedState?.id === 'SK' ? 'selected' : ''} ${hoveredState === 'SK' ? 'pulse' : ''}`}
                    data-name="Sikkim"
                    d="M650 250 L680 250 L690 280 L660 290 L640 270 Z"
                    onClick={() => handleStateClick('SK')}
                    onMouseEnter={() => handleStateHover('SK')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Tripura */}
                  <path 
                    id="IN-TR" 
                    className={`state ${selectedState?.id === 'TR' ? 'selected' : ''} ${hoveredState === 'TR' ? 'pulse' : ''}`}
                    data-name="Tripura"
                    d="M750 350 L780 350 L790 380 L760 390 L740 370 Z"
                    onClick={() => handleStateClick('TR')}
                    onMouseEnter={() => handleStateHover('TR')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Chandigarh */}
                  <path 
                    id="IN-CH" 
                    className={`state ${selectedState?.id === 'CH' ? 'selected' : ''} ${hoveredState === 'CH' ? 'pulse' : ''}`}
                    data-name="Chandigarh"
                    d="M340 240 L350 240 L350 250 L340 250 Z"
                    onClick={() => handleStateClick('CH')}
                    onMouseEnter={() => handleStateHover('CH')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Dadra and Nagar Haveli */}
                  <path 
                    id="IN-DN" 
                    className={`state ${selectedState?.id === 'DN' ? 'selected' : ''} ${hoveredState === 'DN' ? 'pulse' : ''}`}
                    data-name="Dadra and Nagar Haveli"
                    d="M260 580 L280 580 L280 600 L260 600 Z"
                    onClick={() => handleStateClick('DN')}
                    onMouseEnter={() => handleStateHover('DN')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Puducherry */}
                  <path 
                    id="IN-PY" 
                    className={`state ${selectedState?.id === 'PY' ? 'selected' : ''} ${hoveredState === 'PY' ? 'pulse' : ''}`}
                    data-name="Puducherry"
                    d="M500 750 L520 750 L520 770 L500 770 Z"
                    onClick={() => handleStateClick('PY')}
                    onMouseEnter={() => handleStateHover('PY')}
                    onMouseLeave={handleStateLeave}
                  />

                  {/* Lakshadweep */}
                  <path 
                    id="IN-LD" 
                    className={`state ${selectedState?.id === 'LD' ? 'selected' : ''} ${hoveredState === 'LD' ? 'pulse' : ''}`}
                    data-name="Lakshadweep"
                    d="M200 800 L220 800 L220 820 L200 820 Z"
                    onClick={() => handleStateClick('LD')}
                    onMouseEnter={() => handleStateHover('LD')}
                    onMouseLeave={handleStateLeave}
                  />
                </g>

                {/* Andaman & Nicobar Islands */}
                <g id="andaman-group" transform="translate(720,700) scale(0.55)">
                  <circle 
                    id="IN-AN-1" 
                    className={`island state ${selectedState?.id === 'AN' ? 'selected' : ''} ${hoveredState === 'AN' ? 'pulse' : ''}`}
                    data-name="Andaman & Nicobar Islands"
                    cx="40" 
                    cy="40" 
                    r="12"
                    onClick={() => handleStateClick('AN')}
                    onMouseEnter={() => handleStateHover('AN')}
                    onMouseLeave={handleStateLeave}
                  />
                  <circle 
                    id="IN-AN-2" 
                    className={`island state ${selectedState?.id === 'AN' ? 'selected' : ''} ${hoveredState === 'AN' ? 'pulse' : ''}`}
                    data-name="Andaman & Nicobar Islands"
                    cx="80" 
                    cy="52" 
                    r="10"
                    onClick={() => handleStateClick('AN')}
                    onMouseEnter={() => handleStateHover('AN')}
                    onMouseLeave={handleStateLeave}
                  />
                  <circle 
                    id="IN-AN-3" 
                    className={`island state ${selectedState?.id === 'AN' ? 'selected' : ''} ${hoveredState === 'AN' ? 'pulse' : ''}`}
                    data-name="Andaman & Nicobar Islands"
                    cx="120" 
                    cy="74" 
                    r="9"
                    onClick={() => handleStateClick('AN')}
                    onMouseEnter={() => handleStateHover('AN')}
                    onMouseLeave={handleStateLeave}
                  />
                  <text x="0" y="110" font-size="12" fill="#1f3b4a">Andaman & Nicobar</text>
                </g>
              </svg>
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
                    <h3 className="text-xl font-bold text-gray-900">Interactive India Map</h3>
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
                    <p>💡 <strong>Tip:</strong> Hover over states to see them highlighted, then click to explore!</p>
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
