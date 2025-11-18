import { ThemedText } from '@/components/Atoms/ThemedText/ThemedText';
import { ThemedView } from '@/components/Atoms/ThemedView/ThemedView';
import {
  POST_LIST_DEFAULT_PREFETCH_COUNT
} from '@/constants/postListManager.constants';
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

interface PostListManagerStyles {
  endMessage: ViewStyle;
  endMessageText: TextStyle;
  footerLoader: ViewStyle;
  emptyContainer: ViewStyle;
}

interface UsePostListManagerParams {
  posts: Post[];
  isLoadingMore: boolean;
  hasMore: boolean;
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
  isLoadingMore,
  hasMore,
  loadMore,
  theme,
  styles,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, prefetchCount, prefetchStrategy]);

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

  return {
    handleEndReached,
    renderFooter,
    viewabilityConfigCallbackPairs: viewabilityConfigCallbackPairs.current,
    isItemVisible,
  };
};
