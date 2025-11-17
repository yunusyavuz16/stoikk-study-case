import { Icon } from '@/components/Atoms/Icon/Icon';
import { ICONS } from '@constants/icons.constants';
import { useTheme } from '@hooks/useTheme';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Video, { type OnLoadData, type OnProgressData, type VideoRef } from 'react-native-video';
import { PLAY_HIT_SLOP, VIDEO_CONTROLS_STYLES } from './constants';
import { createStyles } from './CustomVideo.styles';
import type { CustomVideoProps } from './CustomVideoProps';
import { useVideoControls } from './hooks/useVideoControls';
import { useVideoError } from './hooks/useVideoError';
import { useVideoTimer } from './hooks/useVideoTimer';

export const CustomVideo = forwardRef<VideoRef, CustomVideoProps>(
  (
    {
      source,
      paused = false,
      repeat = true,
      muted = false,
      resizeMode = 'cover',
      onLoad,
      onProgress,
      onEnd,
      onPlaybackError,
      style,
      aggressiveMemoryMode = true,
      duration,
      showTimer = true,
      enableTapToPlay = false,
      showPlayButton = true,
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const videoRef = useRef<VideoRef | null>(null);

    useImperativeHandle(ref, () => videoRef.current as VideoRef, []);

    const { hasError, retryKey, handleError, resetError } = useVideoError();

    const {
      actualPaused,
      handleTap,
      containerPointerEvents,
      shouldShowPlayButton,
      showTapOverlay,
      syncWithAutoplay,
    } = useVideoControls({
      pausedProp: paused,
      enableTapToPlay,
      showPlayButton,
      hasError,
      onErrorReset: resetError,
    });

    const { shouldShowTimer, formattedTime, updateFromProgress, reset } = useVideoTimer({
      duration,
      showTimer,
      hasError,
    });

    const isValidSource = Boolean(
      source &&
        (typeof source === 'number' ||
          (typeof source === 'object' && 'uri' in source && source.uri)),
    );

    const bufferConfig = aggressiveMemoryMode
      ? {
          minBufferMs: 1000,
          maxBufferMs: 2000,
          bufferForPlaybackMs: 500,
          bufferForPlaybackAfterRebufferMs: 1000,
        }
      : undefined;

    const handleVideoLoad = (data: OnLoadData) => {
      resetError();
      syncWithAutoplay();
      onLoad?.(data);
    };

    const handleVideoProgress = (data: OnProgressData) => {
      updateFromProgress(data.currentTime);
      onProgress?.(data);
    };

    const handleVideoEnd = () => {
      reset();
      onEnd?.();
    };

    const handleVideoError = (error: unknown) => {
      reset();
      handleError(error);
      onPlaybackError?.(error);
    };

    if (!isValidSource) {
      return <View style={[styles.fallback, style]} />;
    }

    const playButtonContent = (
      <View style={styles.playButton}>
        <View style={styles.playIconContainer}>
          <Icon name={ICONS.PLAY} size={48} color="#FFFFFF" family="Ionicons" />
        </View>
      </View>
    );

    return (
      <View style={[styles.container, style]} pointerEvents={containerPointerEvents}>
        <Video
          key={`video-${retryKey}`}
          ref={videoRef}
          source={source as any}
          paused={actualPaused}
          repeat={repeat}
          muted={muted}
          resizeMode={resizeMode}
          onLoad={handleVideoLoad}
          onError={handleVideoError}
          onProgress={handleVideoProgress}
          onEnd={handleVideoEnd}
          controls={false}
          {...(bufferConfig && {
            bufferConfig,
            maxBitRate: 2000000,
            disableFocus: true,
            hideShutterView: true,
            playInBackground: false,
            playWhenInactive: false,
          })}
          ignoreSilentSwitch="ignore"
          fullscreen={false}
          fullscreenAutorotate={false}
          controlsStyles={VIDEO_CONTROLS_STYLES}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {shouldShowTimer && formattedTime && (
          <View style={styles.timerContainer} pointerEvents="none">
            <Text style={styles.timerText}>{formattedTime}</Text>
          </View>
        )}
        {showTapOverlay ? (
          <Pressable style={[StyleSheet.absoluteFill, styles.tapOverlay]} onPress={handleTap}>
            {shouldShowPlayButton && (
              <View style={styles.playButtonContainer} pointerEvents="box-none">
                {playButtonContent}
              </View>
            )}
          </Pressable>
        ) : (
          shouldShowPlayButton && (
            <Pressable
              style={styles.playButtonContainer}
              onPress={handleTap}
              hitSlop={PLAY_HIT_SLOP}>
              {playButtonContent}
            </Pressable>
          )
        )}
      </View>
    );
  },
);

CustomVideo.displayName = 'CustomVideo';
