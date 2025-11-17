import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import Video, { type VideoRef, type OnLoadData, type OnProgressData } from 'react-native-video';
import { Icon } from '@components/Icon/Icon';
import { ICONS } from '@constants/icons.constants';
import type { CustomVideoProps } from './CustomVideoProps';
import { createStyles } from './CustomVideo.styles';
import { useTheme } from '@hooks/useTheme';

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
      const {theme} = useTheme();
      const styles = createStyles(theme);

      const videoRef = useRef<VideoRef | null>(null);
      const [hasError, setHasError] = useState(false);
      const [remainingTime, setRemainingTime] = useState<number | null>(null);
      const [currentTime, setCurrentTime] = useState<number>(0); // Track actual video playback time
      const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

      // Internal play/pause state when tap-to-play is enabled
      // This allows user to manually pause/play while respecting visibility-based autoplay
      // Initialize based on paused prop - if paused=false, video should autoplay
      const [internalPaused, setInternalPaused] = useState(() => {
        // On initial mount, if enableTapToPlay is true and paused is false, start playing
        // Otherwise, respect the paused prop
        return paused;
      });
      const previousPausedPropRef = useRef<boolean>(paused);
      const userPausedRef = useRef<boolean>(false); // Track if user manually paused

      // Reset error state when video becomes visible and should play
      // This allows video to retry loading when it becomes visible
      useEffect(() => {
        if (!paused && hasError) {
          // Video should play but has error - reset error to allow retry
          // The video component will try to load again when key changes
          setHasError(false);
        }
      }, [paused, hasError]);

      // Sync internal state with external paused prop
      // When tap-to-play is disabled, always sync with external prop
      // When tap-to-play is enabled, auto-play when video becomes visible (unless user manually paused)
      useEffect(() => {
        if (!enableTapToPlay) {
          // When tap-to-play is disabled, always sync with external prop
          setInternalPaused(paused);
          userPausedRef.current = false;
        } else {
          // When tap-to-play is enabled:
          // - If paused prop is false (video should play), autoplay unless user manually paused
          // - If paused prop is true (video should pause), pause immediately
          const wasPaused = previousPausedPropRef.current;

          if (paused) {
            // Video should be paused - pause immediately
            setInternalPaused(true);
            // Reset user pause flag when video becomes hidden (paused prop becomes true)
            if (!wasPaused) {
              userPausedRef.current = false;
            }
          } else {
            // Video should play (paused prop is false) - autoplay unless user manually paused
            if (!userPausedRef.current) {
              setInternalPaused(false);
              // Reset error when video should play - allows retry
              if (hasError) {
                setHasError(false);
              }
            }
          }
        }
        previousPausedPropRef.current = paused;
      }, [paused, enableTapToPlay, hasError]);

      // Determine the actual paused state
      const actualPaused = enableTapToPlay ? internalPaused : paused;

      // Handle tap to toggle play/pause
      const handleTap = useCallback(() => {
        // If there's an error, reset it to allow retry
        if (hasError) {
          setHasError(false);
          // Try to play if video should be playing
          if (!paused) {
            setInternalPaused(false);
          }
          return;
        }

        if (enableTapToPlay) {
          setInternalPaused(prev => {
            const newPaused = !prev;
            // Track if user manually paused (true) or manually played (false)
            userPausedRef.current = newPaused;
            return newPaused;
          });
        }
      }, [enableTapToPlay, hasError, paused]);

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
       * Only set initial remaining time if not already set (preserves state when video resumes)
       */
      useEffect(() => {
        const validDuration =
          typeof duration === 'number' && !isNaN(duration) && isFinite(duration) && duration > 0;
        if (validDuration && remainingTime === null) {
          // Only initialize if remainingTime is null (first load)
          setRemainingTime(Math.floor(duration));
        } else if (!validDuration) {
          setRemainingTime(null);
        }
      }, [duration, remainingTime]);

      /**
       * Update remaining time based on actual video progress
       * This ensures timer reflects the real video position, not just a countdown
       */
      useEffect(() => {
        if (duration && duration > 0 && currentTime >= 0) {
          const calculatedRemaining = Math.max(0, Math.floor(duration - currentTime));
          setRemainingTime(calculatedRemaining);
        }
      }, [currentTime, duration]);

      /**
       * Handle timer countdown (fallback for when onProgress doesn't fire frequently enough)
       * Timer only runs when video is visible and playing
       */
      useEffect(() => {
        // Clear existing interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Only run interval as fallback if:
        // 1. Timer is enabled
        // 2. Duration is provided
        // 3. Video is not paused (playing)
        // 4. There's remaining time
        // 5. Video is visible (showTimer is true, which means isVisible && !paused)
        // 6. No error occurred
        // Note: onProgress should be the primary source of truth, this is just a fallback
        if (
          showTimer &&
          duration &&
          duration > 0 &&
          !actualPaused &&
          remainingTime !== null &&
          remainingTime > 0 &&
          !hasError
        ) {
          intervalRef.current = setInterval(() => {
            // Update based on currentTime if available, otherwise decrement
            if (currentTime > 0 && duration > 0) {
              const calculatedRemaining = Math.max(0, Math.floor(duration - currentTime));
              setRemainingTime(calculatedRemaining);
            } else {
              setRemainingTime(prev => {
                if (prev === null || prev <= 0) {
                  return 0;
                }
                return prev - 1;
              });
            }
          }, 1000);
        } else if ((actualPaused || hasError) && intervalRef.current) {
          // Stop timer immediately when video is paused or has error
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Cleanup on unmount or when conditions change
        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        };
      }, [showTimer, duration, actualPaused, remainingTime, hasError, currentTime]);

      /**
       * Reset timer when video ends (resets for repeat or when video loops)
       */
      const handleEnd = useCallback(() => {
        // Reset timer and current time when video ends
        if (duration && duration > 0) {
          setCurrentTime(0);
          setRemainingTime(Math.floor(duration));
        }
        onEnd?.();
      }, [duration, onEnd]);

      /**
       * Reset timer when video loops/repeats
       * When currentTime resets to near 0 after being near the end, video looped
       */
      useEffect(() => {
        // If currentTime resets to near 0 and we were near the end, video likely looped
        if (currentTime < 0.5 && remainingTime !== null && remainingTime < 1 && repeat && duration && duration > 0) {
          setRemainingTime(Math.floor(duration));
        }
      }, [currentTime, remainingTime, repeat, duration]);

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
        // Clear error when video loads successfully
        setHasError(false);
        // When video loads, if it should be playing (enableTapToPlay and not paused),
        // ensure it starts playing. This handles cases where video loads but paused state hasn't synced yet.
        if (enableTapToPlay && !paused && !userPausedRef.current) {
          setInternalPaused(false);
        } else if (!enableTapToPlay && !paused) {
          // When tap-to-play is disabled, sync with paused prop
          setInternalPaused(false);
        }
        // Note: OnLoadData doesn't include currentTime, so we rely on onProgress
        // to set the correct currentTime when video starts/resumes playing
        // The timer will update automatically when onProgress fires
        onLoad?.(data);
      };

      const handleError = (error: any) => {
        console.warn('Video load error:', error);
        setHasError(true);
        // Reset timer when error occurs
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      const handleProgress = (data: OnProgressData) => {
        // Update current time from video progress
        // This is the source of truth for video position
        const newCurrentTime = data.currentTime;
        setCurrentTime(newCurrentTime);

        // Calculate remaining time based on actual video progress
        if (duration && duration > 0) {
          const calculatedRemaining = Math.max(0, Math.floor(duration - newCurrentTime));
          setRemainingTime(calculatedRemaining);
        }

        onProgress?.(data);
      };

      // Use a retry counter to force remount when retrying after error
      const retryKeyRef = useRef(0);
      const previousHasErrorRef = useRef(hasError);
      useEffect(() => {
        // Increment retry key when error is cleared (allows retry)
        if (previousHasErrorRef.current && !hasError) {
          retryKeyRef.current += 1;
        }
        previousHasErrorRef.current = hasError;
      }, [hasError]);

      // Validate source
      const isValidSource =
        source &&
        (typeof source === 'number' ||
          (typeof source === 'object' && 'uri' in source && source.uri));

      // If source is invalid, return fallback
      if (!isValidSource) {
        return <View style={[styles.fallback, style]} />;
      }

      // If there's an error, still render the video component but show play button
      // This allows the video to retry when user taps play or when it becomes visible
      // The video component will handle the error and we can retry by resetting hasError

      const shouldShowTimer =
        showTimer &&
        duration &&
        duration > 0 &&
        remainingTime !== null &&
        remainingTime >= 0 &&
        !hasError; // Don't show timer when there's an error
      // Show play button when:
      // 1. Video is actually paused (either manually or automatically), OR
      // 2. There's an error (so user can retry)
      // When enableTapToPlay is true, always show play button when paused (for manual pause support)
      // When enableTapToPlay is false, respect the showPlayButton prop
      const shouldShowPlayButton =
        hasError ||
        (enableTapToPlay && actualPaused) ||
        (!enableTapToPlay && showPlayButton && actualPaused);

      const videoElement = (
        <Video
          key={`video-${retryKeyRef.current}`} // Force remount on retry
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
          pointerEvents="none"
        />
      );

      // When enableTapToPlay is false, set pointerEvents="none" on container
      // so touches pass through to parent (e.g., TouchableOpacity in MediaGridItem)
      const containerPointerEvents = enableTapToPlay ? 'auto' : 'none';

      return (
        <View style={[styles.container, style]} pointerEvents={containerPointerEvents}>
          {videoElement}
          {shouldShowTimer && (
            <View style={styles.timerContainer} pointerEvents="none">
              <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
            </View>
          )}
          {enableTapToPlay ? (
            <Pressable style={StyleSheet.absoluteFill} onPress={handleTap}>
              {shouldShowPlayButton && (
                <View style={styles.playButtonContainer} pointerEvents="box-none">
                  <Pressable
                    onPress={handleTap}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <View style={styles.playButton}>
                      <View style={styles.playIconContainer}>
                        <Icon name={ICONS.PLAY} size={48} color="#FFFFFF" family="Ionicons" />
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
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <View style={styles.playButton}>
                  <View style={styles.playIconContainer}>
                    <Icon name={ICONS.PLAY} size={48} color="#FFFFFF" family="Ionicons" />
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
