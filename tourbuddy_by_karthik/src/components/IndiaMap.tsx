import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function IndiaMap() {
  const states = useQuery(api.states.getAllStates);
  const navigate = useNavigate();
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const handleStateClick = (stateCode: string) => {
    navigate(`/states/${stateCode}`);
  };

  // Simplified India map with major states
  const stateCoordinates = {
    'MH': { x: 300, y: 400, name: 'Maharashtra' },
    'DL': { x: 280, y: 200, name: 'Delhi' },
    'KA': { x: 280, y: 500, name: 'Karnataka' },
    'RJ': { x: 220, y: 250, name: 'Rajasthan' },
    'GOA': { x: 250, y: 480, name: 'Goa' },
    'KL': { x: 280, y: 580, name: 'Kerala' },
    'UP': { x: 320, y: 220, name: 'Uttar Pradesh' },
    'HP': { x: 280, y: 150, name: 'Himachal Pradesh' },
  };

  return (
    <div className="flex justify-center">
      <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 shadow-lg">
        <svg
          width="600"
          height="700"
          viewBox="0 0 600 700"
          className="max-w-full h-auto"
        >
          {/* India outline (simplified) */}
          <path
            d="M200 150 L400 150 L450 200 L480 300 L450 400 L400 500 L350 600 L300 650 L250 600 L200 550 L150 450 L120 350 L150 250 Z"
            fill="rgba(59, 130, 246, 0.1)"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
          />
          
          {/* State markers */}
          {Object.entries(stateCoordinates).map(([code, coords]) => {
            const stateData = states?.find(s => s.code === code);
            return (
              <g key={code}>
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={hoveredState === code ? 12 : 8}
                  fill={hoveredState === code ? "#3B82F6" : "#10B981"}
                  className="cursor-pointer transition-all duration-200 hover:fill-blue-600"
                  onClick={() => handleStateClick(code)}
                  onMouseEnter={() => setHoveredState(code)}
                  onMouseLeave={() => setHoveredState(null)}
                />
                <text
                  x={coords.x}
                  y={coords.y - 20}
                  textAnchor="middle"
                  className="text-sm font-medium fill-gray-700 pointer-events-none"
                >
                  {coords.name}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Click on any state to explore</p>
          <div className="flex justify-center items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Available States</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Hovered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
