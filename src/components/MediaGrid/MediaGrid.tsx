import React, {useCallback, useRef, useEffect, useMemo} from 'react';
import {View, FlatList, Dimensions, Platform} from 'react-native';
import {MediaGridItem} from './MediaGridItem';
import {useMediaPlayerVisibility} from '@hooks/useMediaPlayerVisibility';
import {useBreakpoint} from '@hooks/useBreakpoint';
import {useImagePrefetch} from '@hooks/useImagePrefetch';
import {createStyles} from './MediaGrid.styles';
import {useTheme} from '@hooks/useTheme';
import type {MediaItem} from '../../types/post.types';

interface MediaGridProps {
  data: MediaItem[];
  numColumns?: number;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

/**
 * Media grid component displaying images and videos in a grid layout
 * Videos auto-play when visible based on viewability
 * Optimized for 120+ items with aggressive performance settings
 */
export const MediaGrid = React.memo<MediaGridProps>(
  ({data, numColumns: propNumColumns}) => {
    const {theme} = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const {breakpoint} = useBreakpoint();
    const {visibleItems, onViewableItemsChanged, isItemVisible} = useMediaPlayerVisibility(50);
    const {prefetchImages} = useImagePrefetch();
    const viewabilityConfig = useRef({
      itemVisiblePercentThreshold: 50,
    });

    // Calculate responsive numColumns based on breakpoint
    const numColumns = useMemo(() => {
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
    }, [propNumColumns, breakpoint]);

    // Prefetch visible items with thumbnails
    useEffect(() => {
      if (data.length > 0 && visibleItems.size > 0) {
        const visibleIndices = Array.from(visibleItems).slice(0, 12);
        const imageItems = visibleIndices
          .map(index => data[index])
          .filter(item => item && item.type === 'image')
          .map(item => ({uri: item.uri, thumbnailUri: item.thumbnail}));
        if (imageItems.length > 0) {
          prefetchImages(imageItems);
        }
      }
    }, [data, visibleItems, prefetchImages]);

    // Calculate item dimensions for 4:5 aspect ratio
    const {itemWidth, itemHeight} = useMemo(() => {
      const width = SCREEN_WIDTH / numColumns;
      // 4:5 aspect ratio: height = width * (5/4) = width * 1.25
      const height = width * 1.25;
      return {itemWidth: width, itemHeight: height};
    }, [numColumns]);

    const renderItem = useCallback(
      ({item, index}: {item: MediaItem; index: number}) => {
        const isVisible = isItemVisible(index);
        return (
          <View style={[styles.gridItem, {width: itemWidth}]}>
            <MediaGridItem
              item={item}
              index={index}
              isVisible={isVisible}
            />
          </View>
        );
      },
      [isItemVisible, itemWidth, styles.gridItem],
    );

    const keyExtractor = useCallback((item: MediaItem) => item.id, []);

    const getItemLayout = useCallback(
      (_: unknown, index: number) => {
        const row = Math.floor(index / numColumns);
        return {
          length: itemHeight, // Height of each item (4:5 aspect ratio)
          offset: row * itemHeight, // Cumulative offset based on row
          index,
        };
      },
      [numColumns, itemHeight],
    );

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
  },
);

MediaGrid.displayName = 'MediaGrid';

