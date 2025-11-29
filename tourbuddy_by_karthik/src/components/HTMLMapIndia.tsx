import React from 'react';
import { useNavigate } from 'react-router-dom';

export function HTMLMapIndia() {
  const navigate = useNavigate();

  const handleStateClick = (stateName: string) => {
    // Convert state name to state code for navigation
    const stateCodeMap: Record<string, string> = {
      'Jammu & Kashmir': 'JK',
      'Himachal Pradesh': 'HP',
      'Punjab': 'PB',
      'Haryana': 'HR',
      'Delhi': 'DL',
      'Uttarakhand': 'UK',
      'Uttar Pradesh': 'UP',
      'Rajasthan': 'RJ',
      'Gujarat': 'GJ',
      'Madhya Pradesh': 'MP',
      'Bihar': 'BR',
      'Jharkhand': 'JH',
      'West Bengal': 'WB',
      'Odisha': 'OR',
      'Chhattisgarh': 'CT',
      'Maharashtra': 'MH',
      'Goa': 'GA',
      'Karnataka': 'KA',
      'Andhra Pradesh': 'AP',
      'Tamil Nadu': 'TN',
      'Kerala': 'KL',
      'Assam': 'AS',
      'Arunachal Pradesh': 'AR',
      'Nagaland': 'NL',
      'Manipur': 'MN',
      'Mizoram': 'MZ',
      'Tripura': 'TR',
      'Meghalaya': 'ML',
      'Sikkim': 'SK',
      'Telangana': 'TG',
      'Ladakh': 'LA',
      'Andaman & Nicobar Islands': 'AN',
      'Chandigarh': 'CH',
      'Dadra & Nagar Haveli': 'DN',
      'Daman & Diu': 'DD',
      'Lakshadweep': 'LD',
      'Puducherry': 'PY'
    };

    const stateCode = stateCodeMap[stateName];
    if (stateCode) {
      navigate(`/places/state/${stateCode}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 text-balance">
            Explore India
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Click on any state to discover its unique culture, history, and attractions
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <div className="relative w-full">
            <img
              src="/indian-map.png"
              alt="Interactive Map of India"
              className="w-full h-auto max-w-full object-contain rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              useMap="#india-map"
            />

            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-gray-200">
              <p className="text-sm text-gray-600 font-medium">Click on any state</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Interactive map of India with 28 states and 8 union territories
          </p>
        </div>

        {/* HTML image map with clickable areas */}
        <map name="india-map">
          {/* Jammu & Kashmir */}
          <area
            shape="poly"
            coords="190,20,280,15,320,45,340,80,320,120,280,140,240,130,200,100,170,60"
            alt="Jammu & Kashmir"
            onClick={() => handleStateClick("Jammu & Kashmir")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Jammu & Kashmir - Paradise on Earth"
          />

          {/* Himachal Pradesh */}
          <area
            shape="poly"
            coords="280,140,320,120,360,140,380,170,350,190,320,180,290,170"
            alt="Himachal Pradesh"
            onClick={() => handleStateClick("Himachal Pradesh")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Himachal Pradesh - Dev Bhoomi"
          />

          {/* Punjab */}
          <area
            shape="poly"
            coords="240,200,290,170,320,180,310,220,280,240,250,230"
            alt="Punjab"
            onClick={() => handleStateClick("Punjab")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Punjab - Land of Five Rivers"
          />

          {/* Haryana */}
          <area
            shape="poly"
            coords="310,220,350,190,380,210,370,250,340,270,310,260"
            alt="Haryana"
            onClick={() => handleStateClick("Haryana")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Haryana - Rich Agricultural Heritage"
          />

          {/* Delhi */}
          <area
            shape="circle"
            coords="340,240,15"
            alt="Delhi"
            onClick={() => handleStateClick("Delhi")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Delhi - Capital of India"
          />

          {/* Uttarakhand */}
          <area
            shape="poly"
            coords="380,170,420,160,460,180,450,220,420,240,380,210"
            alt="Uttarakhand"
            onClick={() => handleStateClick("Uttarakhand")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Uttarakhand - Dev Bhoomi"
          />

          {/* Uttar Pradesh */}
          <area
            shape="poly"
            coords="370,250,450,220,520,240,540,280,520,320,480,340,420,330,380,310,350,280"
            alt="Uttar Pradesh"
            onClick={() => handleStateClick("Uttar Pradesh")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Uttar Pradesh - Heart of India"
          />

          {/* Rajasthan */}
          <area
            shape="poly"
            coords="150,250,280,240,350,280,340,350,300,400,250,420,200,400,150,350,120,300"
            alt="Rajasthan"
            onClick={() => handleStateClick("Rajasthan")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Rajasthan - Land of Kings"
          />

          {/* Gujarat */}
          <area
            shape="poly"
            coords="80,400,150,350,200,400,180,480,140,520,100,500,60,460,50,420"
            alt="Gujarat"
            onClick={() => handleStateClick("Gujarat")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Gujarat - Land of Vibrant Culture"
          />

          {/* Madhya Pradesh */}
          <area
            shape="poly"
            coords="300,400,420,330,480,340,520,380,500,440,460,480,400,500,350,480,320,450"
            alt="Madhya Pradesh"
            onClick={() => handleStateClick("Madhya Pradesh")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Madhya Pradesh - Heart of India"
          />

          {/* Bihar */}
          <area
            shape="poly"
            coords="520,320,580,310,620,330,640,360,620,390,580,400,540,390,520,360"
            alt="Bihar"
            onClick={() => handleStateClick("Bihar")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Bihar - Land of Ancient History"
          />

          {/* Jharkhand */}
          <area
            shape="poly"
            coords="540,390,580,400,600,430,580,460,550,470,520,450,510,420"
            alt="Jharkhand"
            onClick={() => handleStateClick("Jharkhand")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Jharkhand - Land of Waterfalls"
          />

          {/* West Bengal */}
          <area
            shape="poly"
            coords="620,390,660,380,700,400,720,440,700,480,670,500,640,490,620,460,610,430"
            alt="West Bengal"
            onClick={() => handleStateClick("West Bengal")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="West Bengal - Land of Diverse Landscapes"
          />

          {/* Odisha */}
          <area
            shape="poly"
            coords="580,460,620,460,660,480,680,520,660,560,620,580,580,570,560,540,550,500"
            alt="Odisha"
            onClick={() => handleStateClick("Odisha")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Odisha - Land of Ancient Temples"
          />

          {/* Chhattisgarh */}
          <area
            shape="poly"
            coords="460,480,520,450,550,470,560,510,540,540,500,550,470,530,450,500"
            alt="Chhattisgarh"
            onClick={() => handleStateClick("Chhattisgarh")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Chhattisgarh - Land of Dense Forests"
          />

          {/* Maharashtra */}
          <area
            shape="poly"
            coords="250,520,350,480,400,500,450,530,440,580,400,620,350,640,300,630,250,600,220,560"
            alt="Maharashtra"
            onClick={() => handleStateClick("Maharashtra")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Maharashtra - Gateway to India"
          />

          {/* Goa */}
          <area
            shape="poly"
            coords="220,640,250,630,260,660,240,680,220,670,200,650"
            alt="Goa"
            onClick={() => handleStateClick("Goa")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Goa - Beaches and Portuguese Heritage"
          />

          {/* Karnataka */}
          <area
            shape="poly"
            coords="260,660,350,640,400,660,420,720,380,780,340,800,300,790,260,760,240,720,250,680"
            alt="Karnataka"
            onClick={() => handleStateClick("Karnataka")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Karnataka - Silicon Valley of India"
          />

          {/* Telangana */}
          <area
            shape="poly"
            coords="380,600,420,580,440,620,420,660,400,680,380,660,360,640,370,620"
            alt="Telangana"
            onClick={() => handleStateClick("Telangana")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Telangana - Rich History and Culture"
          />

          {/* Andhra Pradesh */}
          <area
            shape="poly"
            coords="440,580,500,550,540,580,560,620,580,660,560,720,520,760,480,740,450,700,430,650,420,620"
            alt="Andhra Pradesh"
            onClick={() => handleStateClick("Andhra Pradesh")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Andhra Pradesh - Land of Rich History"
          />

          {/* Tamil Nadu */}
          <area
            shape="poly"
            coords="380,780,420,720,480,740,520,760,540,800,520,840,480,880,440,900,400,890,360,860,340,820"
            alt="Tamil Nadu"
            onClick={() => handleStateClick("Tamil Nadu")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Tamil Nadu - Land of Temples"
          />

          {/* Kerala */}
          <area
            shape="poly"
            coords="300,790,340,800,360,860,350,920,330,960,310,980,290,970,280,930,270,890,260,850,270,810"
            alt="Kerala"
            onClick={() => handleStateClick("Kerala")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Kerala - God's Own Country"
          />

          {/* Assam */}
          <area
            shape="poly"
            coords="700,380,750,370,800,390,820,420,800,450,760,460,720,450,700,420"
            alt="Assam"
            onClick={() => handleStateClick("Assam")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Assam - Gateway to Northeast India"
          />

          {/* Arunachal Pradesh */}
          <area
            shape="poly"
            coords="750,250,850,240,900,270,920,310,900,350,850,370,800,360,760,340,740,300"
            alt="Arunachal Pradesh"
            onClick={() => handleStateClick("Arunachal Pradesh")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Arunachal Pradesh - Land of Dawn-Lit Mountains"
          />

          {/* Nagaland */}
          <area
            shape="poly"
            coords="820,420,860,410,880,440,870,470,850,480,830,470,820,450"
            alt="Nagaland"
            onClick={() => handleStateClick("Nagaland")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Nagaland - Land of Festivals"
          />

          {/* Manipur */}
          <area
            shape="poly"
            coords="800,450,830,470,840,500,820,520,800,510,780,490,790,470"
            alt="Manipur"
            onClick={() => handleStateClick("Manipur")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Manipur - Jewel of India"
          />

          {/* Mizoram */}
          <area
            shape="poly"
            coords="780,520,800,510,810,540,800,570,780,580,760,570,750,550,760,530"
            alt="Mizoram"
            onClick={() => handleStateClick("Mizoram")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Mizoram - Land of the Hill People"
          />

          {/* Tripura */}
          <area
            shape="poly"
            coords="720,500,750,490,770,520,760,550,740,560,720,550,710,530,715,510"
            alt="Tripura"
            onClick={() => handleStateClick("Tripura")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Tripura - Land of Temples and Palaces"
          />

          {/* Meghalaya */}
          <area
            shape="poly"
            coords="720,440,760,430,780,450,770,480,750,490,720,480,700,460,710,450"
            alt="Meghalaya"
            onClick={() => handleStateClick("Meghalaya")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Meghalaya - Abode of Clouds"
          />

          {/* Sikkim */}
          <area
            shape="poly"
            coords="680,320,700,310,720,330,710,350,690,360,670,350,665,335"
            alt="Sikkim"
            onClick={() => handleStateClick("Sikkim")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Sikkim - Himalayan State with Buddhist Culture"
          />

          {/* Union Territories - Islands */}
          {/* Lakshadweep */}
          <area
            shape="poly"
            coords="50,700,80,690,90,720,80,750,60,760,40,740,30,720"
            alt="Lakshadweep"
            onClick={() => handleStateClick("Lakshadweep")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Lakshadweep - Coral Islands"
          />

          {/* Andaman & Nicobar Islands */}
          <area
            shape="poly"
            coords="850,600,920,580,950,620,940,680,900,720,870,700,840,660"
            alt="Andaman & Nicobar Islands"
            onClick={() => handleStateClick("Andaman & Nicobar Islands")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Andaman & Nicobar Islands - Island Paradise"
          />

          {/* Puducherry */}
          <area
            shape="poly"
            coords="420,820,440,810,450,830,440,850,420,860,400,850,410,830"
            alt="Puducherry"
            onClick={() => handleStateClick("Puducherry")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Puducherry - French Colonial Heritage"
          />

          {/* Chandigarh */}
          <area
            shape="circle"
            coords="320,200,8"
            alt="Chandigarh"
            onClick={() => handleStateClick("Chandigarh")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Chandigarh - The City Beautiful"
          />

          {/* Dadra & Nagar Haveli */}
          <area
            shape="poly"
            coords="200,650,220,640,230,660,220,680,200,670,190,650"
            alt="Dadra & Nagar Haveli"
            onClick={() => handleStateClick("Dadra & Nagar Haveli")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Dadra & Nagar Haveli - Natural Beauty"
          />

          {/* Daman & Diu */}
          <area
            shape="poly"
            coords="180,620,200,610,210,630,200,650,180,640,170,620"
            alt="Daman & Diu"
            onClick={() => handleStateClick("Daman & Diu")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Daman & Diu - Portuguese Colonial Heritage"
          />

          {/* Ladakh */}
          <area
            shape="poly"
            coords="150,20,200,15,220,40,200,80,180,100,150,90,130,70,140,50"
            alt="Ladakh"
            onClick={() => handleStateClick("Ladakh")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Ladakh - High-Altitude Desert"
          />
        </map>
      </div>
    </div>
  );
}
