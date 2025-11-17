import { useBreakpoint } from '@hooks/useBreakpoint';
import { useImagePrefetch } from '@hooks/useImagePrefetch';
import { useMediaPlayerVisibility } from '@hooks/useMediaPlayerVisibility';
import { useTheme } from '@hooks/useTheme';
import React, { useEffect, useRef } from 'react';
import { Dimensions, FlatList, Platform, View } from 'react-native';
import type { MediaItem } from '../../types/post.types';
import { createStyles } from './MediaGrid.styles';
import { MediaGridItem } from './MediaGridItem';

interface MediaGridProps {
  data: MediaItem[];
  numColumns?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Media grid component displaying images and videos in a grid layout
 * Videos auto-play when visible based on viewability
 * Optimized for 120+ items with aggressive performance settings
 */
export const MediaGrid: React.FC<MediaGridProps> = ({ data, numColumns: propNumColumns }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { breakpoint } = useBreakpoint();
  const { visibleItems, onViewableItemsChanged, isItemVisible } = useMediaPlayerVisibility(50);
  const { prefetchImages } = useImagePrefetch();
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  // Calculate responsive numColumns based on breakpoint
  const numColumns = (() => {
    if (propNumColumns) {
      return propNumColumns;
    }
    if (breakpoint === 'xl' || breakpoint === 'lg') {
      return 5;
    }
    if (breakpoint === 'md') {
      return 4;
    }
    return 3;
  })();

  // Prefetch visible items with thumbnails
  useEffect(() => {
    if (data.length > 0 && visibleItems.size > 0) {
      const visibleIndices = Array.from(visibleItems).slice(0, 12);
      const imageItems = visibleIndices
        .map(index => data[index])
        .filter(item => item && item.type === 'image')
        .map(item => ({ uri: item.uri, thumbnailUri: item.thumbnail }));
      if (imageItems.length > 0) {
        prefetchImages(imageItems);
      }
    }
  }, [data, visibleItems]);

  const { itemWidth, itemHeight } = (() => {
    const width = SCREEN_WIDTH / numColumns;
    // 4:5 aspect ratio: height = width * (5/4) = width * 1.25
    const height = width * 1.25;
    return { itemWidth: width, itemHeight: height };
  })();

  const renderItem = ({ item, index }: { item: MediaItem; index: number }) => {
    const isVisible = isItemVisible(index);
    return (
      <View style={[styles.gridItem, { width: itemWidth }]}>
        <MediaGridItem
          id={item.id}
          type={item.type}
          uri={item.uri}
          thumbnail={item.thumbnail}
          duration={item.duration}
          isVisible={isVisible}
        />
      </View>
    );
  };

  const keyExtractor = (item: MediaItem) => item.id;

  const getItemLayout = (_: unknown, index: number) => {
    const row = Math.floor(index / numColumns);
    return {
      length: itemHeight, // Height of each item (4:5 aspect ratio)
      offset: row * itemHeight, // Cumulative offset based on row
      index,
    };
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        style={styles.grid}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={Platform.OS === 'android' ? 6 : 8}
        windowSize={Platform.OS === 'android' ? 5 : 3}
        initialNumToRender={Platform.OS === 'android' ? 12 : 6}
        updateCellsBatchingPeriod={Platform.OS === 'android' ? 80 : 50}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
      />
    </View>
  );
};

MediaGrid.displayName = 'MediaGrid';
