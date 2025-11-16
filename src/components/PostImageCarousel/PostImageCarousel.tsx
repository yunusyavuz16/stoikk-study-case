import React, {useRef, useEffect} from 'react';
import {View, Dimensions} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import type {VideoRef} from 'react-native-video';
import {CustomVideo} from '@components/CustomVideo';
import {useMediaCarousel} from '@hooks/useMediaCarousel';
import {useImagePrefetch} from '@hooks/useImagePrefetch';
import {ImageWithThumbnail} from '@components/ImageWithThumbnail/ImageWithThumbnail';
import {styles} from './PostImageCarousel.styles';
import type {MediaItem} from '../../types/post.types';

interface PostImageCarouselProps {
  media: MediaItem[];
  isVisible?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Swipeable media carousel component (handles both images and videos)
 * with memory management to prevent OOM crashes
 * CRITICAL: Only renders currently visible video to prevent memory issues
 */
export const PostImageCarousel = React.memo<PostImageCarouselProps>(
  ({media, isVisible = true}) => {
    const scrollX = useSharedValue(0);
    const scrollViewRef = useRef<Animated.ScrollView>(null);
    const videoRefs = useRef<Map<number, VideoRef | null>>(new Map());
    // Use shared values for worklet-accessible state
    const currentIndexShared = useSharedValue(0);
    const mediaLengthShared = useSharedValue(media.length);

    const {currentIndex, setCurrentIndex} = useMediaCarousel(media, 0);
    const {prefetchImage} = useImagePrefetch();

    // Update shared values when state changes (these can be accessed in worklets)
    useEffect(() => {
      currentIndexShared.value = currentIndex;
    }, [currentIndex, currentIndexShared]);

    useEffect(() => {
      mediaLengthShared.value = media.length;
    }, [media.length, mediaLengthShared]);

    // Prefetch next carousel item
    useEffect(() => {
      if (currentIndex < media.length - 1) {
        const nextItem = media[currentIndex + 1];
        if (nextItem && nextItem.type === 'image') {
          prefetchImage(nextItem.uri);
        }
      }
    }, [currentIndex, media, prefetchImage]);

    // Cleanup all videos on unmount to prevent memory leaks
    useEffect(() => {
      return () => {
        // Pause all videos when component unmounts
        videoRefs.current.forEach(ref => {
          if (ref) {
            try {
              // react-native-video handles cleanup, but we track refs for safety
            } catch (error) {
              console.warn('Error cleaning up video in carousel:', error);
            }
          }
        });
        videoRefs.current.clear();
      };
    }, []);

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: event => {
        scrollX.value = event.contentOffset.x;
        const index = Math.round(event.contentOffset.x / SCREEN_WIDTH);
        // Use shared values instead of refs in worklet
        if (
          index >= 0 &&
          index < mediaLengthShared.value &&
          index !== currentIndexShared.value
        ) {
          runOnJS(setCurrentIndex)(index);
        }
      },
    });

    const getVideoSource = (uri: string | number) => {
      if (typeof uri === 'string') {
        return {uri};
      }
      return uri as any;
    };

    // CRITICAL FIX: Only render the currently visible video
    // This prevents multiple ExoPlayer instances from being created simultaneously
    const shouldRenderVideo = (index: number) => {
      // Only render video if:
      // 1. Post is visible (isVisible = true)
      // 2. This is the current index in the carousel
      // 3. It's actually a video
      return isVisible && index === currentIndex;
    };

    // Determine if video should be paused
    // Video should be paused if:
    // 1. Post is not visible, OR
    // 2. This is not the current index in the carousel
    const shouldPauseVideo = (index: number) => {
      return !isVisible || index !== currentIndex;
    };

    return (
      <View style={styles.container}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}>
          {media.map((item, index) => {
            const isVideo = item.type === 'video';
            const shouldRender = !isVideo || shouldRenderVideo(index);

            return (
              <View key={item.id} style={styles.imageContainer}>
                {item.type === 'image' ? (
                  <ImageWithThumbnail
                    uri={item.uri}
                    thumbnailUri={item.thumbnail}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : shouldRender ? (
                  // CRITICAL: Only render Video component when it should be visible
                  // This prevents ExoPlayer from initializing for off-screen videos
                  <CustomVideo
                    ref={ref => {
                      if (ref) {
                        videoRefs.current.set(index, ref);
                      } else {
                        videoRefs.current.delete(index);
                      }
                    }}
                    source={getVideoSource(item.uri)}
                    style={styles.image}
                    paused={shouldPauseVideo(index)}
                    duration={item.duration}
                    showTimer={isVisible && index === currentIndex && !shouldPauseVideo(index)}
                    enableTapToPlay={isVisible && index === currentIndex}
                    showPlayButton={shouldPauseVideo(index) || (isVisible && index === currentIndex)}
                  />
                ) : (
                  // CRITICAL: Render placeholder View instead of Video when not visible
                  // This prevents ExoPlayer initialization and memory allocation
                  <View style={[styles.image, { backgroundColor: '#000000' }]} />
                )}
              </View>
            );
          })}
        </Animated.ScrollView>
        {media.length > 1 && (
          <View style={styles.pagination}>
            {media.map((_, index) => {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const dotStyle = useAnimatedStyle(() => {
                const inputRange = [
                  (index - 1) * SCREEN_WIDTH,
                  index * SCREEN_WIDTH,
                  (index + 1) * SCREEN_WIDTH,
                ];
                const scale = interpolate(
                  scrollX.value,
                  inputRange,
                  [0.8, 1.2, 0.8],
                  Extrapolate.CLAMP,
                );
                const opacity = interpolate(
                  scrollX.value,
                  inputRange,
                  [0.5, 1, 0.5],
                  Extrapolate.CLAMP,
                );
                return {
                  transform: [{scale}],
                  opacity,
                };
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentIndex && styles.dotActive,
                    dotStyle,
                  ]}
                />
              );
            })}
          </View>
        )}
      </View>
    );
  },
);

PostImageCarousel.displayName = 'PostImageCarousel';
