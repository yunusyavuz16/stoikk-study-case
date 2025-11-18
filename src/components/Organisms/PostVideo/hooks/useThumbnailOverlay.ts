import { useEffect, useRef, useState } from 'react';
import type { Source } from 'react-native-fast-image';
import type { OnLoadData } from 'react-native-video';

export type ThumbnailSource = Source | number | undefined;

interface UseThumbnailOverlayParams {
  thumbnailSource: ThumbnailSource;
  showInitialThumbnailOverlay?: boolean;
  thumbnailOverlayDelayMs: number;
  videoId: string;
}

interface UseThumbnailOverlayResult {
  shouldShowThumbnail: boolean;
  handleVideoLoad: (event: OnLoadData) => void;
  handleVideoError: (error?: unknown) => void;
}

/**
 * Manages thumbnail visibility for PostVideo, ensuring images remain visible
 * during initial video render delays and when playback errors occur.
 */
export const useThumbnailOverlay = ({
  thumbnailSource,
  showInitialThumbnailOverlay = false,
  thumbnailOverlayDelayMs,
  videoId,
}: UseThumbnailOverlayParams): UseThumbnailOverlayResult => {
  const thumbnailDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasVideoError, setHasVideoError] = useState(false);

  const shouldEnableInitialThumbnailOverlay = Boolean(
    showInitialThumbnailOverlay && thumbnailSource,
  );

  const [isInitialThumbnailDelayElapsed, setIsInitialThumbnailDelayElapsed] = useState(
    !shouldEnableInitialThumbnailOverlay,
  );

  const clearThumbnailDelay = () => {
    if (thumbnailDelayTimeoutRef.current) {
      clearTimeout(thumbnailDelayTimeoutRef.current);
      thumbnailDelayTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    setIsInitialThumbnailDelayElapsed(!shouldEnableInitialThumbnailOverlay);
    setHasVideoError(false);
    clearThumbnailDelay();
  }, [shouldEnableInitialThumbnailOverlay, videoId]);

  useEffect(
    () => () => {
      clearThumbnailDelay();
    },
    [],
  );

  const handleVideoLoad = (_event: OnLoadData) => {
    setHasVideoError(false);
    if (!shouldEnableInitialThumbnailOverlay) {
      return;
    }

    clearThumbnailDelay();
    thumbnailDelayTimeoutRef.current = setTimeout(() => {
      setIsInitialThumbnailDelayElapsed(true);
    }, thumbnailOverlayDelayMs);
  };

  const handleVideoError = (_error?: unknown) => {
    setHasVideoError(true);
    clearThumbnailDelay();
  };

  const shouldShowThumbnail = Boolean(
    thumbnailSource &&
      (hasVideoError || (shouldEnableInitialThumbnailOverlay && !isInitialThumbnailDelayElapsed)),
  );

  return {
    shouldShowThumbnail,
    handleVideoLoad,
    handleVideoError,
  };
};
