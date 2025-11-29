import React, { useState, useEffect } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Clock, DollarSign, ExternalLink, Camera } from 'lucide-react';

interface Place {
  _id: string;
  state: string;
  stateCode: string;
  placeName: string;
  category: string;
  description?: string;
  timings?: string;
  entryFee?: string;
  bestTime?: string;
  nearestRailway?: string;
  nearestBus?: string;
  nearestAirport?: string;
  metroStation?: string;
  accessibility?: string;
  guidedTours?: string;
  parking?: string;
  nearbyAmenities?: string;
  officialWebsite?: string;
  wikipedia?: string;
  specialNotes?: string;
  imageUrl?: string;
}

interface PlaceCardProps {
  place: Place;
  showImages?: boolean;
}

interface UnsplashImage {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, showImages = true }) => {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const getPlaceImages = useAction(api.ai.getPlaceImages);

  useEffect(() => {
    if (showImages && place.placeName) {
      loadImages();
    }
  }, [place.placeName, showImages]);

  const loadImages = async () => {
    setLoadingImages(true);
    try {
      const imageData = await getPlaceImages({ 
        placeName: place.placeName,
        count: 5 
      });
      setImages(imageData);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  const formatEntryFee = (fee?: string) => {
    if (!fee) return 'Free';
    return fee;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Beach': 'bg-blue-100 text-blue-800',
      'Historical Monument': 'bg-amber-100 text-amber-800',
      'Hill Station': 'bg-green-100 text-green-800',
      'Temple': 'bg-purple-100 text-purple-800',
      'National Park': 'bg-emerald-100 text-emerald-800',
      'Museum': 'bg-orange-100 text-orange-800',
      'Fort': 'bg-red-100 text-red-800',
      'Waterfall': 'bg-cyan-100 text-cyan-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Section */}
      {showImages && (
        <div className="relative h-48 bg-gray-200">
          {loadingImages ? (
            <div className="flex items-center justify-center h-full">
              <Camera className="w-8 h-8 text-gray-400 animate-pulse" />
            </div>
          ) : images.length > 0 ? (
            <div className="relative h-full">
              <img
                src={images[selectedImageIndex]?.url}
                alt={images[selectedImageIndex]?.alt || place.placeName}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <div className="absolute bottom-2 left-2 flex space-x-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge className={getCategoryColor(place.category)}>
                  {place.category}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-purple-100">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">{place.placeName}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {place.placeName}
        </CardTitle>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          {place.state}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Description */}
        {place.description && place.description !== 'nan' && (
          <p className="text-sm text-gray-700 line-clamp-3">
            {place.description}
          </p>
        )}

        {/* Key Information */}
        <div className="space-y-2">
          {place.timings && place.timings !== 'nan' && (
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-gray-700">{place.timings}</span>
            </div>
          )}

          {place.entryFee && place.entryFee !== 'nan' && (
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-gray-700">{formatEntryFee(place.entryFee)}</span>
            </div>
          )}

          {place.bestTime && place.bestTime !== 'nan' && (
            <div className="text-sm text-gray-700">
              <strong>Best time:</strong> {place.bestTime}
            </div>
          )}
        </div>

        {/* Special Notes */}
        {place.specialNotes && place.specialNotes !== 'nan' && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Special Notes:</p>
            <p className="text-sm text-blue-700 mt-1">{place.specialNotes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {place.officialWebsite && place.officialWebsite !== 'nan' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(place.officialWebsite, '_blank')}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Website
            </Button>
          )}
          
          {place.wikipedia && place.wikipedia !== 'nan' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(place.wikipedia, '_blank')}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Wikipedia
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
