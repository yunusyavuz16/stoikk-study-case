import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Video, { type OnLoadData, type OnProgressData, type VideoRef } from 'react-native-video';
import { useTheme } from '@hooks/useTheme';
import { VIDEO_CONTROLS_STYLES } from './constants';
import { createStyles } from './CustomVideo.styles';
import type { CustomVideoProps } from './CustomVideoProps';

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
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const videoRef = useRef<VideoRef | null>(null);

    useImperativeHandle(ref, () => videoRef.current as VideoRef, []);

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
      onLoad?.(data);
    };

    const handleVideoProgress = (data: OnProgressData) => {
      onProgress?.(data);
    };

    const handleVideoEnd = () => {
      onEnd?.();
    };

    const handleVideoError = (error: unknown) => {
      onPlaybackError?.(error);
    };

    if (!isValidSource) {
      return <View style={[styles.fallback, style]} />;
    }

    return (
      <View style={[styles.container, style]}>
        <Video
          ref={videoRef}
          source={source as any}
          paused={paused}
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
      </View>
    );
  },
);

CustomVideo.displayName = 'CustomVideo';
