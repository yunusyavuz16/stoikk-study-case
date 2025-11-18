import { Icon } from '@/components/Atoms/Icon/Icon';
import { CustomVideo } from '@/components/Molecules/CustomVideo/CustomVideo';
import {
  CustomVideoTimer,
  type CustomVideoTimerRef,
} from '@/components/Molecules/CustomVideo/components/CustomVideoTimer/CustomVideoTimer';
import { PLAY_HIT_SLOP } from '@/components/Molecules/CustomVideo/constants';
import { useVideoControls } from '@/components/Molecules/CustomVideo/hooks/useVideoControls';
import { useVideoError } from '@/components/Molecules/CustomVideo/hooks/useVideoError';
import { ICONS } from '@constants/icons.constants';
import { DEFAULT_THUMBNAIL_OVERLAY_DELAY_MS } from '@constants/post.constants';
import { useTheme } from '@hooks/useTheme';
import React, { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import type { OnLoadData, OnProgressData } from 'react-native-video';
import type { MediaItem } from '../../../types/post.types';
import { createStyles } from './PostVideo.styles';
import { useThumbnailOverlay, type ThumbnailSource } from './hooks/useThumbnailOverlay';

interface PostVideoProps {
  video: MediaItem;
  paused?: boolean;
  isVisible?: boolean;
  showPlayButton?: boolean;
  showTimer?: boolean;
  enableTapToPlay?: boolean;
  showInitialThumbnailOverlay?: boolean;
  thumbnailOverlayDelayMs?: number;
}

/**
 * Displays a post video with optional thumbnail overlay support for
 * initial render delays and playback errors.
 */
export const PostVideo: React.FC<PostVideoProps> = ({
  video,
  paused = false,
  isVisible = true,
  showPlayButton,
  showTimer,
  enableTapToPlay,
  showInitialThumbnailOverlay = false,
  thumbnailOverlayDelayMs = DEFAULT_THUMBNAIL_OVERLAY_DELAY_MS,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme)
  const timerRef = useRef<CustomVideoTimerRef | null>(null);

  const getVideoSource = (uri: string | number) => {
    if (typeof uri === 'string') {
      return { uri };
    }
    return uri as any;
  };

  const getThumbnailSource = (): ThumbnailSource => {
    if (video.thumbnail) {
      return typeof video.thumbnail === 'string' ? { uri: video.thumbnail } : video.thumbnail;
    }
    return undefined;
  };

  const thumbnailSource = getThumbnailSource();

  const { shouldShowThumbnail, handleVideoLoad, handleVideoError } = useThumbnailOverlay({
    thumbnailSource,
    showInitialThumbnailOverlay,
    thumbnailOverlayDelayMs,
    videoId: video.id,
  });

  const shouldPause = paused || !isVisible;

  const shouldEnableTapToPlay = enableTapToPlay ?? isVisible;

  const shouldShowPlayButton = showPlayButton ?? (shouldPause || shouldEnableTapToPlay);

  const shouldShowTimer = showTimer ?? (isVisible && !shouldPause);

  const { hasError, retryKey, handleError, resetError } = useVideoError();

  const {
    actualPaused,
    handleTap,
    shouldShowPlayButton: controlsShowPlayButton,
    showTapOverlay,
    syncWithAutoplay,
  } = useVideoControls({
    pausedProp: shouldPause,
    enableTapToPlay: shouldEnableTapToPlay,
    showPlayButton: shouldShowPlayButton,
    hasError,
    onErrorReset: resetError,
  });

  const playButtonContent = (
    <View style={styles.playButton}>
      <View style={styles.playIconContainer}>
        <Icon name={ICONS.PLAY} size={48} color="#FFFFFF" family="Ionicons" />
      </View>
    </View>
  );

  const handleLoad = (event: OnLoadData) => {
    resetError();
    syncWithAutoplay();
    handleVideoLoad(event);
  };

  const handleProgress = (event: OnProgressData) => {
    timerRef.current?.updateFromProgress(event.currentTime);
  };

  const handleEnd = () => {
    timerRef.current?.reset();
  };

  const handlePlaybackError = (error?: unknown) => {
    timerRef.current?.reset();
    handleError(error ?? new Error('Video playback error'));
    handleVideoError(error);
  };

  const shouldRenderPlayButton = controlsShowPlayButton;

  return (
    <View style={styles.container} pointerEvents={shouldEnableTapToPlay ? 'auto' : 'none'}>
      {shouldShowThumbnail && thumbnailSource && (
        <FastImage
          source={thumbnailSource}
          style={styles.thumbnail}
          resizeMode={FastImage.resizeMode.cover}
          pointerEvents="none"
        />
      )}

      <CustomVideo
        key={`video-${retryKey}`}
        source={getVideoSource(video.uri)}
        paused={actualPaused}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onEnd={handleEnd}
        onPlaybackError={handlePlaybackError}
        muted={false}
        repeat={true}
        style={styles.video}
      />
      <CustomVideoTimer
        ref={timerRef}
        duration={video.duration}
        showTimer={shouldShowTimer}
        hasError={hasError}
      />
      {showTapOverlay ? (
        <Pressable style={[StyleSheet.absoluteFill, styles.tapOverlay]} onPress={handleTap}>
          {shouldRenderPlayButton && (
            <View style={styles.playButtonContainer} pointerEvents="box-none">
              {playButtonContent}
            </View>
          )}
        </Pressable>
      ) : (
        shouldRenderPlayButton && (
          <Pressable style={styles.playButtonContainer} onPress={handleTap} hitSlop={PLAY_HIT_SLOP}>
            {playButtonContent}
          </Pressable>
        )
      )}
    </View>
  );
};

PostVideo.displayName = 'PostVideo';
