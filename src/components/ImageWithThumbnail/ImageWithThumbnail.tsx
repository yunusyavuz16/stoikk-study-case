import React, { useMemo, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import FastImage, { type ResizeMode } from 'react-native-fast-image';
import { useProgressiveImage } from '@/components/ImageWithThumbnail/hooks/useProgressiveImage';
import { imageCacheService, CachePriority } from '@services/imageCacheService';
import { useTheme } from '@hooks/useTheme';
import { getCacheMode } from './utils/imageUtils';

interface ImageWithThumbnailProps {
  uri: string | number;
  thumbnailUri?: string | number;
  style?: ViewStyle;
  resizeMode?: ResizeMode;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Progressive image loading component
 *
 * Features:
 * - Always displays thumbnail first when available (no black placeholders)
 * - Smooth transition from thumbnail → full image
 * - Optimized caching with proper priority levels
 * - Handles all edge cases (missing thumbnail, errors, local assets, URLs)
 * - No flickering or blank frames
 *
 * Rendering strategy:
 * 1. Thumbnail layer (z-index: 2) - shown until full image loads
 * 2. Full image layer (z-index: 1) - loads in background
 * 3. Loading indicator (z-index: 3) - only shown if no thumbnail available
 * 4. Error state - shown if both thumbnail and full image fail
 */
export const ImageWithThumbnail = React.memo<ImageWithThumbnailProps>(
  ({ uri, thumbnailUri, style, resizeMode = 'cover', onLoad, onError }) => {
    const { theme } = useTheme();
    const {
      imageUri,
      thumbnailUri: thumbUri,
      isFullImageLoaded,
      hasError,
      onLoad: handleFullImageLoad,
      onError: handleFullImageError,
      onThumbnailLoad,
    } = useProgressiveImage(uri, thumbnailUri);

    // Memoized callbacks to prevent unnecessary re-renders
    const handleImageLoad = useCallback(() => {
      handleFullImageLoad();
      onLoad?.();
    }, [handleFullImageLoad, onLoad]);

    const handleImageError = useCallback(() => {
      handleFullImageError();
      onError?.();
    }, [handleFullImageError, onError]);

    const handleThumbnailLoad = useCallback(() => {
      onThumbnailLoad();
    }, [onThumbnailLoad]);

    // Get optimized cache source for thumbnail
    const thumbnailSource = useMemo(() => {
      if (!thumbUri) return null;
      const cacheMode = getCacheMode(thumbUri);
      return imageCacheService.getCacheSource(thumbUri, cacheMode, CachePriority.HIGH);
    }, [thumbUri]);

    // Get optimized cache source for full image
    const fullImageSource = useMemo(() => {
      const cacheMode = getCacheMode(imageUri);
      return imageCacheService.getCacheSource(imageUri, cacheMode, CachePriority.NORMAL);
    }, [imageUri]);

    // Show loading indicator only if no thumbnail is available and image is loading
    // Don't show if there's an error (error state will be shown instead)
    const shouldShowLoading = useMemo(() => {
      return thumbUri === null && !isFullImageLoaded && !hasError;
    }, [thumbUri, isFullImageLoaded, hasError]);

    const styles = useMemo(
      () =>
        StyleSheet.create({
          container: {
            overflow: 'hidden',
            backgroundColor: 'transparent',
            // Ensure container takes up space immediately
            minHeight: 1,
            minWidth: 1,
          },
          imageLayer: {
            ...StyleSheet.absoluteFillObject,
          },
          thumbnailLayer: {
            ...StyleSheet.absoluteFillObject,
            zIndex: 2,
            // Ensure thumbnail layer covers entire area immediately
            backgroundColor: 'transparent',
          },
          fullImageLayer: {
            ...StyleSheet.absoluteFillObject,
            zIndex: 1,
            backgroundColor: 'transparent',
          },
          loadingContainer: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            zIndex: 3,
          },
          errorContainer: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: theme.colors.border,
            zIndex: 1,
          },
        }),
      [theme.colors.border],
    );

    return (
      <View style={[styles.container, style]} pointerEvents="none">
        {(!hasError || (hasError && thumbUri === null)) && (
          <View style={styles.fullImageLayer} pointerEvents="none">
            <FastImage
              source={fullImageSource}
              style={styles.imageLayer}
              resizeMode={resizeMode}
              onLoad={handleImageLoad}
              onError={handleImageError}
              pointerEvents="none"
            />
          </View>
        )}

        {thumbUri !== null && thumbnailSource !== null && !isFullImageLoaded && (
          <View style={styles.thumbnailLayer} pointerEvents="none">
            <FastImage
              source={thumbnailSource}
              style={styles.imageLayer}
              resizeMode={resizeMode}
              onLoad={handleThumbnailLoad}
              pointerEvents="none"
            />
          </View>
        )}

        {/* Loading indicator - only shown when no thumbnail is available */}
        {shouldShowLoading && (
          <View style={styles.loadingContainer} pointerEvents="none">
            <ActivityIndicator size="small" color={theme.colors.textSecondary} />
          </View>
        )}

        {/* Error state - shown only when both thumbnail and full image fail */}
        {hasError && thumbUri === null && (
          <View style={styles.errorContainer} pointerEvents="none" />
        )}
      </View>
    );
  },
);

ImageWithThumbnail.displayName = 'ImageWithThumbnail';
