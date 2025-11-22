import { useState, useRef, useEffect } from 'react';
import { getThumbnailUrl, getFullImageUrl } from '@/lib/utils/image-utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  thumbnailSize?: number;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  thumbnailSize = 300,
  onLoad,
  onError,
  priority = false,
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate thumbnail and full image URLs
  const thumbnailUrl = getThumbnailUrl(src, thumbnailSize);
  const fullImageUrl = getFullImageUrl(src);

  useEffect(() => {
    if (!src) return;

    // Start with thumbnail
    setImageSrc(thumbnailUrl);
    setIsLoaded(false);
    setHasError(false);
  }, [src, thumbnailUrl]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setHasError(true);
    onError?.();

    // Fallback to full image if thumbnail fails
    if (imageSrc === thumbnailUrl) {
      setImageSrc(fullImageUrl);
    }
  };

  const handleThumbnailLoad = () => {
    // Once thumbnail is loaded, load the full image
    if (imageSrc === thumbnailUrl) {
      const fullImg = new Image();
      fullImg.onload = () => {
        setImageSrc(fullImageUrl);
      };
      fullImg.onerror = () => {
        // Keep using thumbnail if full image fails
        console.warn('Failed to load full image, using thumbnail');
      };
      fullImg.src = fullImageUrl;
    }
  };

  if (hasError && !imageSrc) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-200 ${className} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={imageSrc === thumbnailUrl ? handleThumbnailLoad : handleImageLoad}
        onError={handleImageError}
        loading={priority ? 'eager' : 'lazy'}
      />

      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div
          className={`absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center ${className}`}
        >
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
