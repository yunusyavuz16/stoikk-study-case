import { ImageWithThumbnail } from '@/components/Organisms/ImageWithThumbnail/ImageWithThumbnail';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useTheme } from '@hooks/useTheme';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { MediaItem } from '../../../types/post.types';
import { useMediaCarousel } from './hooks/useMediaCarousel';
import { PaginationDotComponent } from './PaginationDot';
import { createStyles } from './PostImageCarousel.styles';

interface PostImageCarouselProps {
  media: MediaItem[];
}

/**
 * Displays a paged carousel for post media with animated pagination indicators.
 */
export const PostImageCarousel: React.FC<PostImageCarouselProps> = ({ media }) => {
  const { theme } = useTheme();
  const { width: SCREEN_WIDTH } = useBreakpoint();
  const styles = createStyles(theme, SCREEN_WIDTH);

  const scrollX = useSharedValue(0);
  const currentIndexShared = useSharedValue(0);
  const mediaLengthShared = useSharedValue(media.length);

  const { currentIndex, setCurrentIndex } = useMediaCarousel(media, 0);

  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
  };

  // Update shared values when state changes (these can be accessed in worklets)
  useEffect(() => {
    currentIndexShared.value = currentIndex;
  }, [currentIndex, currentIndexShared]);

  useEffect(() => {
    mediaLengthShared.value = media.length;
  }, [media.length, mediaLengthShared]);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: event => {
        const contentOffsetX = event.contentOffset.x;
        scrollX.value = contentOffsetX;
        const index = Math.round(contentOffsetX / SCREEN_WIDTH);

        if (index >= 0 && index < mediaLengthShared.value && index !== currentIndexShared.value) {
          scheduleOnRN(handleIndexChange, index);
        }
      },
    },
    [],
  );

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        {media.map(item => (
          <View key={item.id} style={styles.imageContainer}>
            <ImageWithThumbnail
              uri={item.uri}
              thumbnailUri={item.thumbnail}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </Animated.ScrollView>
      {media.length > 1 && (
        <View style={styles.pagination}>
          {media.map((item, index) => (
            <PaginationDotComponent
              key={item.id}
              index={index}
              scrollX={scrollX}
              screenWidth={SCREEN_WIDTH}
              isActive={currentIndex === index}
              dotStyle={styles.dot}
              activeDotStyle={styles.dotActive}
            />
          ))}
        </View>
      )}
    </View>
  );
};

PostImageCarousel.displayName = 'PostImageCarousel';
