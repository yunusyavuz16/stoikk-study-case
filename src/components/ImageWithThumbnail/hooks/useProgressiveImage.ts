import {useState, useCallback, useEffect, useRef} from 'react';

interface UseProgressiveImageReturn {
  imageUri: string | number;
  thumbnailUri: string | number | null;
  isThumbnailLoaded: boolean;
  isFullImageLoaded: boolean;
  hasError: boolean;
  onLoad: () => void;
  onError: () => void;
  onThumbnailLoad: () => void;
}

/**
 * Hook for progressive image loading
 * Manages thumbnail → full image loading strategy
 * Tracks thumbnail and full image load states separately for optimal rendering
 */
export const useProgressiveImage = (
  uri: string | number,
  thumbnailUri?: string | number,
): UseProgressiveImageReturn => {
  const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false);
  const [isFullImageLoaded, setIsFullImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const previousUriRef = useRef<string | number>(uri);
  const previousThumbnailUriRef = useRef<string | number | undefined>(thumbnailUri);

  // Reset states when URI or thumbnail URI changes
  useEffect(() => {
    const uriChanged = previousUriRef.current !== uri;
    const thumbnailChanged = previousThumbnailUriRef.current !== thumbnailUri;

    if (uriChanged || thumbnailChanged) {
      setIsThumbnailLoaded(false);
      setIsFullImageLoaded(false);
      setHasError(false);
      previousUriRef.current = uri;
      previousThumbnailUriRef.current = thumbnailUri;
    }
  }, [uri, thumbnailUri]);

  const onThumbnailLoad = useCallback(() => {
    setIsThumbnailLoaded(true);
  }, []);

  const onLoad = useCallback(() => {
    setIsFullImageLoaded(true);
    setHasError(false);
  }, []);

  const onError = useCallback(() => {
    setHasError(true);
    // Note: If full image fails but thumbnail is available, thumbnail remains visible
    // This is handled by the component's rendering logic
  }, []);

  return {
    imageUri: uri,
    thumbnailUri: thumbnailUri || null,
    isThumbnailLoaded,
    isFullImageLoaded,
    hasError,
    onLoad,
    onError,
    onThumbnailLoad,
  };
};

