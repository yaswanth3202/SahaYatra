import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  Train, 
  Bus, 
  Plane, 
  Car, 
  Users, 
  Accessibility, 
  Camera, 
  Star,
  Calendar,
  Navigation,
  Utensils,
  Bed,
  ShoppingBag,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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

interface PlaceDetailCardProps {
  place: Place;
  onClose?: () => void;
}

export function PlaceDetailCard({ place, onClose }: PlaceDetailCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // Generate multiple high-quality images for the place
    const placeImages = [
      `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      `https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`
    ];
    setImages(placeImages);
  }, [place]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const InfoSection = ({ icon: Icon, title, content, color = "blue" }: {
    icon: React.ElementType;
    title: string;
    content: string;
    color?: string;
  }) => (
    <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative h-80 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
          {/* Main Image */}
          <div className="relative w-full h-full">
            <img
              src={images[currentImageIndex]}
              alt={place.place_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm">
                  {currentImageIndex + 1} / {images.length}
                </span>
              </div>
            )}

            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <span className="text-white text-xl">×</span>
              </button>
            )}

            {/* Place Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-3 py-1 bg-blue-600/80 backdrop-blur-sm rounded-full text-sm font-medium">
                  {place.category}
                </span>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{place.state}</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">{place.place_name}</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {place.timings && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Timings</p>
                  <p className="font-medium text-gray-800">{place.timings}</p>
                </div>
              </div>
            )}

            {place.entry_fee && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Entry Fee</p>
                  <p className="font-medium text-gray-800">{place.entry_fee}</p>
                </div>
              </div>
            )}

            {place.best_time && (
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-500">Best Time</p>
                  <p className="font-medium text-gray-800">{place.best_time}</p>
                </div>
              </div>
            )}
          </div>

          {/* Transportation Section */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Navigation className="w-6 h-6 mr-2 text-blue-600" />
              How to Reach
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {place.nearest_railway && (
                <InfoSection
                  icon={Train}
                  title="Nearest Railway Station"
                  content={place.nearest_railway}
                  color="blue"
                />
              )}
              {place.nearest_bus && (
                <InfoSection
                  icon={Bus}
                  title="Nearest Bus Stand"
                  content={place.nearest_bus}
                  color="green"
                />
              )}
              {place.nearest_airport && (
                <InfoSection
                  icon={Plane}
                  title="Nearest Airport"
                  content={place.nearest_airport}
                  color="purple"
                />
              )}
              {place.metro_station && (
                <InfoSection
                  icon={Train}
                  title="Nearest Metro Station"
                  content={place.metro_station}
                  color="orange"
                />
              )}
            </div>
          </div>

          {/* Facilities & Services */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-green-600" />
              Facilities & Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {place.accessibility && (
                <InfoSection
                  icon={Accessibility}
                  title="Accessibility"
                  content={place.accessibility}
                  color="blue"
                />
              )}
              {place.guided_tours && (
                <InfoSection
                  icon={Users}
                  title="Guided Tours"
                  content={place.guided_tours}
                  color="green"
                />
              )}
              {place.parking && (
                <InfoSection
                  icon={Car}
                  title="Parking"
                  content={place.parking}
                  color="purple"
                />
              )}
              {place.nearby_amenities && (
                <InfoSection
                  icon={Utensils}
                  title="Nearby Amenities"
                  content={place.nearby_amenities}
                  color="orange"
                />
              )}
            </div>
          </div>

          {/* Special Notes */}
          {place.special_notes && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Info className="w-6 h-6 mr-2 text-yellow-600" />
                Special Notes & Tips
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 leading-relaxed">{place.special_notes}</p>
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="flex flex-col sm:flex-row gap-3">
            {place.official_website && (
              <a
                href={place.official_website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Official Website
              </a>
            )}
            
            {place.wikipedia && (
              <a
                href={place.wikipedia}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Wikipedia
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
