import { EmptyState } from '@/components/Molecules/EmptyState/EmptyState';
import { GridSkeleton } from '@/components/Molecules/Skeleton/Skeleton';
import { useGetPosts } from '@/hooks/useGetPosts';
import { useResponsiveColumns } from '@/screens/Search/hooks/useResponsiveColumns';
import type { MediaItem } from '@/types/post.types';
import { useBreakpoint } from '@hooks/useBreakpoint';
import { usePostListManager } from '@hooks/usePostListManager';
import { useTheme } from '@hooks/useTheme';
import React, { useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { MediaGridItem } from '../MediaGridItem/MediaGridItem';
import { createStyles } from './MediaGrid.styles';

/**
 * Scrollable grid that reuses feed data while applying local search filtering.
 */
export const MediaGrid: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const { width: SCREEN_WIDTH } = useBreakpoint();
  const { theme } = useTheme();
  const { breakpoint } = useBreakpoint();
  const styles = createStyles(theme, breakpoint);

  const { posts, isLoading, isLoadingMore, error, hasMore, refresh, loadMore } = useGetPosts(20);
  const { handleEndReached, renderFooter, viewabilityConfigCallbackPairs, isItemVisible } =
    usePostListManager({
      posts,
      isLoadingMore,
      hasMore,
      loadMore,
      theme,
      styles,
      prefetchStrategy: 'all',
    });

  const numColumns = useResponsiveColumns({ breakpoint });

  const { itemWidth } = (() => {
    const width = SCREEN_WIDTH / numColumns;
    return { itemWidth: width };
  })();

  const keyExtractor = (item: MediaItem) => item.id;

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

  const renderEmpty = () => {
    if (isLoading) {
      return <GridSkeleton numColumns={numColumns} />;
    }

    if (error) {
      return <EmptyState type="network" message={error.message} onRetry={refresh} />;
    }

    return <EmptyState type="feed" />;
  };

  // Extract media from posts and create mapping
  const media = useMemo(() => {
    const mediaItems: MediaItem[] = [];
    const filteredPosts = posts.filter(p =>
      p.caption.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    for (const post of filteredPosts) {
      for (const mediaItem of post.media) {
        mediaItems.push(mediaItem);
      }
    }

    return mediaItems;
  }, [posts, searchQuery]);

  return (
    <View style={styles.container}>
      <FlatList
        data={media}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        style={styles.grid}
        removeClippedSubviews
        maxToRenderPerBatch={3}
        windowSize={5}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.8}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        // Memory optimization: track visible items to unmount off-screen videos
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
        initialNumToRender={2}
        updateCellsBatchingPeriod={100}
      />
    </View>
  );
};

MediaGrid.displayName = 'MediaGrid';
