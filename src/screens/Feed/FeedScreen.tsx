import { ThemedText } from '@/components/Atoms/ThemedText/ThemedText';
import { ThemedView } from '@/components/Atoms/ThemedView/ThemedView';
import { EmptyState } from '@/components/Molecules/EmptyState/EmptyState';
import { PostSkeleton } from '@/components/Molecules/Skeleton/Skeleton';
import { Post } from '@/components/Organisms/Post/Post';
import { FeedHeader } from '@/screens/Feed/components/FeedHeader/FeedHeader';
import { useFeedRTK } from '@/screens/Feed/hooks/useFeedRTK';
import { useBreakpoint } from '@hooks/useBreakpoint';
import { useImagePrefetch } from '@hooks/useImagePrefetch';
import { useMediaPlayerVisibility } from '@hooks/useMediaPlayerVisibility';
import { useTheme } from '@hooks/useTheme';
import React, { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Post as PostType } from '../../types/post.types';
import { createStyles } from './FeedScreen.styles';

export const FeedScreen: React.FC = () => {
  const { theme } = useTheme();
  const { breakpoint } = useBreakpoint();
  const styles = createStyles(theme, breakpoint);
  const { posts, isLoading, isLoadingMore, error, hasMore, refresh, loadMore, toggleLike } =
    useFeedRTK();
  const { prefetchImages } = useImagePrefetch();
  const { onViewableItemsChanged, isItemVisible } = useMediaPlayerVisibility(50);

  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 200,
  });

  const handleLike = useCallback((postId: string) => {
    toggleLike(postId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEndReached = () => {
    if (hasMore && !isLoadingMore) {
      loadMore();
    }
  };

  // Prefetch next posts' media when scrolling (with thumbnails)
  useEffect(() => {
    if (posts.length > 0) {
      const nextPosts = posts.slice(0, 5); // Prefetch first 5 posts
      const mediaItems = nextPosts.flatMap(post =>
        post.media
          .filter(m => m.type === 'image')
          .map(m => ({ uri: m.uri, thumbnailUri: m.thumbnail })),
      );
      if (mediaItems.length > 0) {
        prefetchImages(mediaItems);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  const renderPost = ({ item, index }: { item: PostType; index: number }) => {
    const isVisible = isItemVisible(index);
    return (
      <View>
        <Post
          id={item.id}
          userId={item.userId}
          username={item.username}
          userAvatar={item.userAvatar}
          type={item.type}
          media={item.media}
          caption={item.caption}
          likes={item.likes}
          comments={item.comments}
          timestamp={item.timestamp}
          isLiked={item.isLiked}
          onLike={handleLike}
          isVisible={isVisible}
        />
      </View>
    );
  };

  const keyExtractor = (item: PostType) => {
    return item.id;
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
    // Show loading skeleton during initial load
    if (isLoading) {
      return (
        <ThemedView style={styles.emptyContainer}>
          {Array.from({ length: 3 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </ThemedView>
      );
    }
    if (error) {
      return <EmptyState type="network" message={error.message} onRetry={refresh} />;
    }
    // Only show "no posts yet" when loading is complete and there are no posts
    return <EmptyState type="feed" />;
  };

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: viewabilityConfigRef.current,
      onViewableItemsChanged,
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <FeedHeader />
      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Error: {error.message}</ThemedText>
        </ThemedView>
      )}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={3}
        windowSize={5}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.8}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        // Memory optimization: track visible items to pause off-screen videos
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        initialNumToRender={2}
        updateCellsBatchingPeriod={100}
      />
    </SafeAreaView>
  );
};
