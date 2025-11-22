/**
 * Utility functions for image handling and optimization
 */

/**
 * Generates a thumbnail URL for an image
 * @param imagePath - The original image path
 * @param size - The thumbnail size (width)
 * @returns The thumbnail URL
 */
export function getThumbnailUrl(imagePath: string, size: number = 300): string {
  if (!imagePath) return '';

  const baseUrl = import.meta.env.VITE_API_URL;

  // If it's already a full URL, extract the path
  let path = imagePath;
  if (imagePath.startsWith('http')) {
    path = imagePath.replace(baseUrl, '');
  }

  // Remove leading slash if present
  path = path.replace(/^\//, '');

  // Generate thumbnail URL (assuming backend supports thumbnail generation)
  // This could be adjusted based on your backend's thumbnail API
  return `${baseUrl}/media/thumbnails/${size}/${path}`;
}

/**
 * Gets the full resolution image URL
 * @param imagePath - The original image path
 * @returns The full resolution image URL
 */
export function getFullImageUrl(imagePath: string): string {
  if (!imagePath) return '';

  const baseUrl = import.meta.env.VITE_API_URL;

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Remove leading slash if present
  const path = imagePath.replace(/^\//, '');

  return `${baseUrl}/media/${path}`;
}

/**
 * Generates different thumbnail sizes for responsive loading
 */
export const THUMBNAIL_SIZES = {
  small: 150,
  medium: 300,
  large: 600,
} as const;

/**
 * Gets responsive thumbnail URLs for an image
 * @param imagePath - The original image path
 * @returns Object with different size URLs
 */
export function getResponsiveThumbnails(imagePath: string) {
  return {
    small: getThumbnailUrl(imagePath, THUMBNAIL_SIZES.small),
    medium: getThumbnailUrl(imagePath, THUMBNAIL_SIZES.medium),
    large: getThumbnailUrl(imagePath, THUMBNAIL_SIZES.large),
    full: getFullImageUrl(imagePath),
  };
}
