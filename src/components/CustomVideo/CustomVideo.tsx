import React, {useRef, useState, forwardRef, useImperativeHandle, useEffect, useCallback} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import Video, {type VideoRef, type OnLoadData, type OnProgressData} from 'react-native-video';
import {Icon} from '@components/Icon/Icon';
import {ICONS} from '@constants/icons.constants';
import type {CustomVideoProps} from './CustomVideoProps';
import { styles } from './CustomVideo.styles';

/**
 * Reusable video component that wraps react-native-video
 * Centralizes video-related logic and provides aggressive memory management
 * to prevent OOM crashes on low-end devices
 */
export const CustomVideo = React.memo(
  forwardRef<VideoRef, CustomVideoProps>(
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
        style,
        aggressiveMemoryMode = true,
        duration,
        showTimer = true,
        enableTapToPlay = false,
        showPlayButton = true,
      },
      ref,
    ) => {
      const videoRef = useRef<VideoRef | null>(null);
      const [hasError, setHasError] = useState(false);
      const [remainingTime, setRemainingTime] = useState<number | null>(null);
      const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
      const previousPausedForTimerRef = useRef<boolean>(paused);

      // Internal play/pause state when tap-to-play is enabled
      const [internalPaused, setInternalPaused] = useState(paused);
      const previousPausedPropRef = useRef<boolean>(paused);

      // Sync internal state with external paused prop
      // When tap-to-play is disabled, always sync with external prop
      // When tap-to-play is enabled, auto-play when video becomes visible (paused changes from true to false)
      useEffect(() => {
        if (!enableTapToPlay) {
          // When tap-to-play is disabled, always sync with external prop
          setInternalPaused(paused);
        } else {
          // When tap-to-play is enabled:
          // - If video becomes visible (paused: true -> false), auto-play
          // - If video becomes hidden (paused: false -> true), pause
          // - On initial mount with paused=false, start playing
          const wasPaused = previousPausedPropRef.current;
          if (wasPaused && !paused) {
            // Video just became visible - auto-play
            setInternalPaused(false);
          } else if (!wasPaused && paused) {
            // Video just became hidden - pause
            setInternalPaused(true);
          } else if (wasPaused === paused) {
            // Initial mount or prop hasn't changed - sync with prop (auto-play if paused=false)
            setInternalPaused(paused);
          }
        }
        previousPausedPropRef.current = paused;
      }, [paused, enableTapToPlay]);

      // Determine the actual paused state
      const actualPaused = enableTapToPlay ? internalPaused : paused;

      // Handle tap to toggle play/pause
      const handleTap = useCallback(() => {
        if (enableTapToPlay) {
          setInternalPaused(prev => !prev);
        }
      }, [enableTapToPlay]);

      // Expose video ref to parent components
      useImperativeHandle(ref, () => videoRef.current as VideoRef, []);

      /**
       * Format seconds to MM:SS format
       */
      const formatTime = useCallback((seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      }, []);

      /**
       * Initialize timer with duration
       * Validates that duration is a valid positive number
       */
      useEffect(() => {
        const validDuration =
          typeof duration === 'number' && !isNaN(duration) && isFinite(duration) && duration > 0;
        if (validDuration) {
          setRemainingTime(Math.floor(duration));
        } else {
          setRemainingTime(null);
        }
      }, [duration]);

      /**
       * Handle timer countdown
       */
      useEffect(() => {
        // Clear existing interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Only run timer if:
        // 1. Timer is enabled
        // 2. Duration is provided
        // 3. Video is not paused
        // 4. There's remaining time
        if (showTimer && duration && duration > 0 && !actualPaused && remainingTime !== null && remainingTime > 0) {
          intervalRef.current = setInterval(() => {
            setRemainingTime(prev => {
              if (prev === null || prev <= 0) {
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }

        // Cleanup on unmount or when conditions change
        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        };
      }, [showTimer, duration, actualPaused, remainingTime]);

      /**
       * Reset timer when video ends (resets for repeat or when video loops)
       */
      const handleEnd = useCallback(() => {
        // Reset timer when video ends (works for both repeat and non-repeat)
        if (duration && duration > 0) {
          setRemainingTime(duration);
        }
        onEnd?.();
      }, [duration, onEnd]);

      /**
       * Reset timer when video starts playing (if it was paused)
       */
      useEffect(() => {
        // If video was paused and now is playing, reset timer
        if (previousPausedForTimerRef.current && !actualPaused && duration && duration > 0) {
          setRemainingTime(duration);
        }
        previousPausedForTimerRef.current = actualPaused;
      }, [actualPaused, duration]);

      /**
       * Reset timer when remaining time reaches 0 (video ended)
       */
      useEffect(() => {
        if (remainingTime === 0 && duration && duration > 0 && repeat) {
          // If video is set to repeat, reset timer after a brief delay
          const resetTimer = setTimeout(() => {
            setRemainingTime(duration);
          }, 100);
          return () => clearTimeout(resetTimer);
        }
        return undefined;
      }, [remainingTime, duration, repeat]);

      // Aggressive buffer configuration to prevent OOM crashes
      const bufferConfig = aggressiveMemoryMode
        ? {
            minBufferMs: 1000,
            maxBufferMs: 2000,
            bufferForPlaybackMs: 500,
            bufferForPlaybackAfterRebufferMs: 1000,
          }
        : undefined;

      const handleLoad = (data: OnLoadData) => {
        setHasError(false);
        onLoad?.(data);
      };

      const handleError = () => {
        setHasError(true);
      };

      const handleProgress = (data: OnProgressData) => {
        onProgress?.(data);
      };

      // Validate source
      const isValidSource =
        source &&
        (typeof source === 'number' || (typeof source === 'object' && 'uri' in source && source.uri));

      // Return fallback black View if source is invalid or load fails
      if (!isValidSource || hasError) {
        return <View style={[styles.fallback, style]} />;
      }

      const shouldShowTimer = showTimer && duration && duration > 0 && remainingTime !== null && remainingTime >= 0;
      const shouldShowPlayButton = enableTapToPlay && showPlayButton && actualPaused;

      const videoElement = (
        <Video
          ref={videoRef}
          source={source as any}
          paused={actualPaused}
          repeat={repeat}
          muted={muted}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
          onProgress={handleProgress}
          onEnd={handleEnd}
          controls={false}
          // Aggressive memory management settings
          {...(aggressiveMemoryMode && {
            bufferConfig,
            maxBitRate: 2000000, // 2 Mbps max
            disableFocus: true,
            hideShutterView: true,
            playInBackground: false,
            playWhenInactive: false,
          })}
          // Additional settings for cleaner playback
          ignoreSilentSwitch="ignore"
          fullscreen={false}
          fullscreenAutorotate={false}
          controlsStyles={{
            hidePosition: true,
            hidePlayPause: true,
            hideForward: true,
            hideRewind: true,
            hideNext: true,
            hidePrevious: true,
            hideFullscreen: true,
            hideSeekBar: true,
            hideDuration: true,
            hideNavigationBarOnFullScreenMode: true,
            hideNotificationBarOnFullScreenMode: true,
            hideSettingButton: true,
          }}
          style={StyleSheet.absoluteFill}
          pointerEvents={enableTapToPlay ? 'none' : 'auto'}
        />
      );

      return (
        <View style={[styles.container, style]}>
          {videoElement}
          {shouldShowTimer && (
            <View style={styles.timerContainer} pointerEvents="none">
              <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
            </View>
          )}
          {enableTapToPlay ? (
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={handleTap}>
              {shouldShowPlayButton && (
                <View style={styles.playButtonContainer} pointerEvents="box-none">
                  <Pressable
                    onPress={handleTap}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                    <View style={styles.playButton}>
                      <View style={styles.playIconContainer}>
                        <Icon
                          name={ICONS.PLAY}
                          size={48}
                          color="#FFFFFF"
                          family="Ionicons"
                        />
                      </View>
                    </View>
                  </Pressable>
                </View>
              )}
            </Pressable>
          ) : (
            shouldShowPlayButton && (
              <Pressable
                style={styles.playButtonContainer}
                onPress={handleTap}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <View style={styles.playButton}>
                  <View style={styles.playIconContainer}>
                    <Icon
                      name={ICONS.PLAY}
                      size={48}
                      color="#FFFFFF"
                      family="Ionicons"
                    />
                  </View>
                </View>
              </Pressable>
            )
          )}
        </View>
      );
    },
  ),
);

CustomVideo.displayName = 'CustomVideo';



