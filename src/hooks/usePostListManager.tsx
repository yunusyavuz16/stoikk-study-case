import { ThemedText } from '@/components/Atoms/ThemedText/ThemedText';
import { ThemedView } from '@/components/Atoms/ThemedView/ThemedView';
import { EmptyState } from '@/components/Molecules/EmptyState/EmptyState';
import { PostSkeleton } from '@/components/Molecules/Skeleton/Skeleton';
import type { Post } from '@/types/post.types';
import type { Theme } from '@styles/theme';
import type { ReactElement } from 'react';
import { useEffect, useRef } from 'react';
import type {
  TextStyle,
  ViewabilityConfig,
  ViewabilityConfigCallbackPairs,
  ViewStyle,
} from 'react-native';
import { ActivityIndicator } from 'react-native';
import { useImagePrefetch } from './useImagePrefetch';
import { useMediaPlayerVisibility } from './useMediaPlayerVisibility';
import { POST_LIST_DEFAULT_PREFETCH_COUNT, POST_LIST_DEFAULT_SKELETON_COUNT } from '@/constants/postListManager.constants';

interface PostListManagerStyles {
  endMessage: ViewStyle;
  endMessageText: TextStyle;
  footerLoader: ViewStyle;
  emptyContainer: ViewStyle;
}

interface UsePostListManagerParams {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  refresh: () => void;
  loadMore: () => void;
  theme: Theme;
  styles: PostListManagerStyles;
  skeletonCount?: number;
  prefetchStrategy?: 'limited' | 'all';
  prefetchCount?: number;
}

interface UsePostListManagerReturn {
  handleEndReached: () => void;
  renderFooter: () => ReactElement | null;
  renderEmpty: () => ReactElement;
  viewabilityConfigCallbackPairs: ViewabilityConfigCallbackPairs;
  isItemVisible: (index: number) => boolean;
}

/**
 * Shared list logic between feed and media grid to avoid duplication.
 * Handles pagination helpers, render callbacks, viewability tracking,
 * and media prefetching responsibilities.
 */
export const usePostListManager = ({
  posts,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  refresh,
  loadMore,
  theme,
  styles,
  skeletonCount = POST_LIST_DEFAULT_SKELETON_COUNT,
  prefetchStrategy = 'limited',
  prefetchCount = POST_LIST_DEFAULT_PREFETCH_COUNT,
}: UsePostListManagerParams): UsePostListManagerReturn => {
  const { prefetchImages } = useImagePrefetch();
  const { onViewableItemsChanged, isItemVisible } = useMediaPlayerVisibility(50);

  const viewabilityConfigRef = useRef<ViewabilityConfig>({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 200,
  });

  const viewabilityConfigCallbackPairs = useRef<ViewabilityConfigCallbackPairs>([
    {
      viewabilityConfig: viewabilityConfigRef.current,
      onViewableItemsChanged,
    },
  ]);

  useEffect(() => {
    if (!posts.length) {
      return;
    }

    const targetPosts =
      prefetchStrategy === 'all' ? posts : posts.slice(0, Math.max(prefetchCount, 0));

    const mediaItems = targetPosts.flatMap(post =>
      post.media
        .filter(media => media.type === 'image')
        .map(media => ({ uri: media.uri, thumbnailUri: media.thumbnail })),
    );

    if (mediaItems.length) {
      prefetchImages(mediaItems);
    }
  }, [posts, prefetchCount, prefetchStrategy, prefetchImages]);

  const handleEndReached = () => {
    if (hasMore && !isLoadingMore) {
      loadMore();
    }
  };

  const renderFooter = () => {
    if (!hasMore && posts.length > 0) {
      return (
        <ThemedView style={styles.endMessage}>
          <ThemedText style={styles.endMessageText}>No more posts</ThemedText>
        </ThemedView>
      );
    }

    if (!isLoadingMore) {
      return null;
    }

    return (
      <ThemedView style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </ThemedView>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <ThemedView style={styles.emptyContainer}>
          {Array.from({ length: skeletonCount }, (_, index) => (
            <PostSkeleton key={`skeleton-${index}`} />
          ))}
        </ThemedView>
      );
    }

    if (error) {
      return <EmptyState type="network" message={error.message} onRetry={refresh} />;
    }

    return <EmptyState type="feed" />;
  };

  return {
    handleEndReached,
    renderFooter,
    renderEmpty,
    viewabilityConfigCallbackPairs: viewabilityConfigCallbackPairs.current,
    isItemVisible,
  };
};
