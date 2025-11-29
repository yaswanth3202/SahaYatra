// Image service for fetching beautiful images from Unsplash
const UNSPLASH_ACCESS_KEY = "0Jdj0HdnS_6o70cafNtFlzsq8lrgKcH24h9Bh_WOqjY";
const UNSPLASH_API_URL = "https://api.unsplash.com";

export interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

export class ImageService {
  private static cache = new Map<string, UnsplashImage[]>();

  static async getPlaceImages(placeName: string, count: number = 3): Promise<UnsplashImage[]> {
    const cacheKey = `place_${placeName}_${count}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(placeName + ' india tourism')}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      const images = data.results || [];
      
      this.cache.set(cacheKey, images);
      return images;
    } catch (error) {
      console.error('Error fetching place images:', error);
      return this.getFallbackImages(count);
    }
  }

  static async getStateImages(stateName: string, count: number = 1): Promise<UnsplashImage[]> {
    const cacheKey = `state_${stateName}_${count}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(stateName + ' india tourism landscape')}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      const images = data.results || [];
      
      this.cache.set(cacheKey, images);
      return images;
    } catch (error) {
      console.error('Error fetching state images:', error);
      return this.getFallbackImages(count);
    }
  }

  static async getCategoryImages(category: string, count: number = 1): Promise<UnsplashImage[]> {
    const cacheKey = `category_${category}_${count}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(category + ' india tourism')}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      const images = data.results || [];
      
      this.cache.set(cacheKey, images);
      return images;
    } catch (error) {
      console.error('Error fetching category images:', error);
      return this.getFallbackImages(count);
    }
  }

  static async getBackgroundImages(count: number = 1): Promise<UnsplashImage[]> {
    const cacheKey = `background_${count}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=india tourism landscape beautiful&per_page=${count}&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      const images = data.results || [];
      
      this.cache.set(cacheKey, images);
      return images;
    } catch (error) {
      console.error('Error fetching background images:', error);
      return this.getFallbackImages(count);
    }
  }

  private static getFallbackImages(count: number): UnsplashImage[] {
    const fallbackImages: UnsplashImage[] = [];
    
    for (let i = 0; i < count; i++) {
      fallbackImages.push({
        id: `fallback_${i}`,
        urls: {
          small: `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center`,
          regular: `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center`,
          full: `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop&crop=center`
        },
        alt_description: 'Beautiful India landscape',
        user: { name: 'Unsplash' }
      });
    }
    
    return fallbackImages;
  }

  static getOptimizedImageUrl(image: UnsplashImage, size: 'small' | 'regular' | 'full' = 'regular'): string {
    return image.urls[size];
  }
}
