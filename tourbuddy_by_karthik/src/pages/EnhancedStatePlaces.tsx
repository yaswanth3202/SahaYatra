import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Clock, DollarSign, ExternalLink, Grid, List, Filter, Star, Eye } from 'lucide-react';
import cleanedPlacesData from '../data/cleaned/all_places_cleaned.json';
import { PlaceDetailCard } from '../components/PlaceDetailCard';
import { ImageService, UnsplashImage } from '../services/imageService';
import { allIndianStates, getStateByCode } from '../data/indianStates';
import { CompactWeatherWidget } from '../components/WeatherWidget';

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

export function EnhancedStatePlaces() {
  const { stateCode } = useParams<{ stateCode: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [stateImage, setStateImage] = useState<UnsplashImage | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [stateInfo, setStateInfo] = useState<{ name: string; description: string; imageUrl: string } | null>(null);

  // Get state information dynamically from comprehensive state data
  const getStateDetails = (code: string) => {
    const state = getStateByCode(code);
    if (!state) return null;
    
    return {
      name: state.name,
      description: state.description,
      imageKeyword: `${state.name.toLowerCase()} ${state.highlights[0]?.toLowerCase() || 'tourism'}`
    };
  };

  const allPlaces: Place[] = cleanedPlacesData as Place[];
  const statePlaces = allPlaces.filter(place => place.stateCode === stateCode);

  // Get unique categories for this state
  const categories = ['all', ...Array.from(new Set(statePlaces.map(place => place.category)))];

  useEffect(() => {
    if (stateCode) {
      const details = getStateDetails(stateCode);
      if (details) {
        setStateInfo({
          name: details.name,
          description: details.description,
          imageUrl: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`
        });

        // Load state image from Unsplash
        const loadStateImage = async () => {
          try {
            const images = await ImageService.getStateImages(details.name, 1);
            if (images.length > 0) {
              setStateImage(images[0]);
            }
          } catch (error) {
            console.error('Error loading state image:', error);
          }
        };

        loadStateImage();
      }
    }
  }, [stateCode]);

  useEffect(() => {
    let filtered = statePlaces;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(place =>
        place.place_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (place.description && place.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (place.special_notes && place.special_notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(place => place.category === selectedCategory);
    }

    setFilteredPlaces(filtered);
  }, [searchTerm, selectedCategory, statePlaces]);

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
  };

  if (!stateInfo || !stateCode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">State not found</h2>
          <p className="text-gray-600 mb-4">The state code "{stateCode}" is not recognized.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Enhanced Header */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={stateImage ? ImageService.getOptimizedImageUrl(stateImage, 'full') : stateInfo.imageUrl}
            alt={stateInfo.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = stateInfo.imageUrl;
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-4xl">
            <button
              onClick={() => navigate('/places')}
              className="flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to States
            </button>
            
            <h1 className="text-5xl font-bold mb-4">{stateInfo.name}</h1>
            <p className="text-xl text-white/90 mb-6 max-w-2xl">{stateInfo.description}</p>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-white/80">
                <MapPin className="w-6 h-6 mr-2" />
                <span className="text-lg">{statePlaces.length} places to explore</span>
              </div>
              <div className="flex items-center text-white/80">
                <Star className="w-6 h-6 mr-2" />
                <span className="text-lg">Amazing destinations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search places in this state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full lg:w-64 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg appearance-none bg-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 border-r border-gray-300 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-lg text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredPlaces.length}</span> places in {stateInfo.name}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Weather Widget */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Weather in {stateInfo.name}</h2>
          <CompactWeatherWidget location={stateInfo.name} />
        </div>

        {/* Places Grid/List */}
        {filteredPlaces.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredPlaces.map((place) => (
              <div
                key={place._id}
                onClick={() => handlePlaceClick(place)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group"
              >
                {/* Place Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                    alt={place.place_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-sm rounded-full font-medium">
                      {place.category}
                    </span>
                  </div>

                  {/* View Button */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Quick Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-bold mb-1 line-clamp-2">{place.place_name}</h3>
                    <div className="flex items-center space-x-4 text-sm">
                      {place.timings && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Open</span>
                        </div>
                      )}
                      {place.entry_fee && (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>{place.entry_fee.includes('Free') ? 'Free' : 'Paid'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Place Content */}
                <div className="p-5">
                  {/* Key Information */}
                  <div className="space-y-3 mb-4">
                    {place.best_time && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 mr-2 text-yellow-500" />
                        <span><strong>Best time:</strong> {place.best_time}</span>
                      </div>
                    )}

                    {place.nearest_railway && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="truncate">{place.nearest_railway}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {place.official_website && (
                      <a
                        href={place.official_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Website
                      </a>
                    )}
                    
                    {place.wikipedia && (
                      <a
                        href={place.wikipedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Wikipedia
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No places found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <PlaceDetailCard
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </div>
  );
}
