import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, DollarSign, ExternalLink, Car, Train, Plane, Bus, Users, Accessibility, Camera, Star } from 'lucide-react';
import cleanedPlacesData from '../data/cleaned/all_places_cleaned.json';
import { WeatherWidget } from '../components/WeatherWidget';

interface Place {
  _id: string;
  state: string;
  stateCode: string;
  place_name: string;
  category: string;
  description?: string;
  timings?: string;
  entry_fee?: string;
  best_time?: string;
  nearest_railway?: string;
  nearest_bus?: string;
  nearest_airport?: string;
  metro_station?: string;
  accessibility?: string;
  guided_tours?: string;
  parking?: string;
  nearby_amenities?: string;
  official_website?: string;
  wikipedia?: string;
  special_notes?: string;
}

export function PlaceDetail() {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<Place | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const allPlaces: Place[] = cleanedPlacesData as Place[];

  useEffect(() => {
    const foundPlace = allPlaces.find(p => p._id === placeId);
    if (foundPlace) {
      setPlace(foundPlace);
      // Generate multiple images for the place
      const placeImages = [
        `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
        `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
        `https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
        `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`
      ];
      setImages(placeImages);
    }
    setLoading(false);
  }, [placeId, allPlaces]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading place details...</p>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Place not found</h2>
          <button
            onClick={() => navigate('/places')}
            className="text-blue-600 hover:text-blue-800"
          >
            Go back to states
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/places/state/${place.stateCode}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to {place.state}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Place Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Image */}
            <div className="lg:w-1/2">
              <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
                <img
                  src={images[0]}
                  alt={place.place_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                    {place.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Place Info */}
            <div className="lg:w-1/2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{place.place_name}</h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{place.state}</span>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {place.timings && (
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Timings</p>
                      <p className="font-medium">{place.timings}</p>
                    </div>
                  </div>
                )}

                {place.entry_fee && (
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Entry Fee</p>
                      <p className="font-medium">{place.entry_fee}</p>
                    </div>
                  </div>
                )}

                {place.best_time && (
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-3 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-500">Best Time</p>
                      <p className="font-medium">{place.best_time}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {place.official_website && (
                  <a
                    href={place.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Official Website
                  </a>
                )}
                
                {place.wikipedia && (
                  <a
                    href={place.wikipedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Wikipedia
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Weather Widget */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Weather</h2>
          <WeatherWidget location={`${place.place_name}, ${place.state}`} />
        </div>

        {/* Additional Images */}
        {images.length > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.slice(1).map((image, index) => (
                <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${place.place_name} ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transportation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Reach</h2>
            
            <div className="space-y-4">
              {place.nearest_railway && (
                <div className="flex items-start">
                  <Train className="w-6 h-6 mr-3 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Nearest Railway Station</p>
                    <p className="text-gray-600">{place.nearest_railway}</p>
                  </div>
                </div>
              )}

              {place.nearest_bus && (
                <div className="flex items-start">
                  <Bus className="w-6 h-6 mr-3 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Nearest Bus Stand</p>
                    <p className="text-gray-600">{place.nearest_bus}</p>
                  </div>
                </div>
              )}

              {place.nearest_airport && (
                <div className="flex items-start">
                  <Plane className="w-6 h-6 mr-3 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Nearest Airport</p>
                    <p className="text-gray-600">{place.nearest_airport}</p>
                  </div>
                </div>
              )}

              {place.metro_station && (
                <div className="flex items-start">
                  <Train className="w-6 h-6 mr-3 text-orange-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Nearest Metro Station</p>
                    <p className="text-gray-600">{place.metro_station}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Facilities & Services */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Facilities & Services</h2>
            
            <div className="space-y-4">
              {place.accessibility && (
                <div className="flex items-start">
                  <Accessibility className="w-6 h-6 mr-3 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Accessibility</p>
                    <p className="text-gray-600">{place.accessibility}</p>
                  </div>
                </div>
              )}

              {place.guided_tours && (
                <div className="flex items-start">
                  <Users className="w-6 h-6 mr-3 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Guided Tours</p>
                    <p className="text-gray-600">{place.guided_tours}</p>
                  </div>
                </div>
              )}

              {place.parking && (
                <div className="flex items-start">
                  <Car className="w-6 h-6 mr-3 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Parking</p>
                    <p className="text-gray-600">{place.parking}</p>
                  </div>
                </div>
              )}

              {place.nearby_amenities && (
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-3 text-orange-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Nearby Amenities</p>
                    <p className="text-gray-600">{place.nearby_amenities}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Special Notes */}
        {place.special_notes && (
          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Special Notes</h2>
            <p className="text-blue-800 leading-relaxed">{place.special_notes}</p>
          </div>
        )}

        {/* Description */}
        {place.description && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Place</h2>
            <p className="text-gray-700 leading-relaxed">{place.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
