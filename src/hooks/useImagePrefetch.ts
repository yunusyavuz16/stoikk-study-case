import { CachePriority, imageCacheService } from '@services/imageCacheService';

interface UseImagePrefetchReturn {
  prefetchImage: (
    uri: string | number,
    thumbnailUri?: string | number,
    priority?: CachePriority,
  ) => void;
  prefetchImages: (
    items: Array<{ uri: string | number; thumbnailUri?: string | number }>,
    priority?: CachePriority,
  ) => void;
  isPrefetched: (uri: string | number) => boolean;
  isThumbnailPrefetched: (thumbnailUri: string | number) => boolean;
}

/**
 * Hook for image prefetching with cache management
 * Preloads images and thumbnails before they're needed for smoother UX
 * Uses centralized cache service for optimal performance
 */
export const useImagePrefetch = (): UseImagePrefetchReturn => {
  const prefetchImage = (
    uri: string | number,
    thumbnailUri?: string | number,
    priority: CachePriority = CachePriority.NORMAL,
  ) => {
    imageCacheService.prefetchImage(uri, thumbnailUri, priority);
  };

  const prefetchImages = (
    items: Array<{ uri: string | number; thumbnailUri?: string | number }>,
    priority: CachePriority = CachePriority.NORMAL,
  ) => {
    imageCacheService.prefetchImages(items, priority);
  };

  const isPrefetched = (uri: string | number) => {
    return imageCacheService.isPrefetched(uri);
  };

  const isThumbnailPrefetched = (thumbnailUri: string | number) => {
    return imageCacheService.isThumbnailPrefetched(thumbnailUri);
  };

  return {
    prefetchImage,
    prefetchImages,
    isPrefetched,
    isThumbnailPrefetched,
  };
};
