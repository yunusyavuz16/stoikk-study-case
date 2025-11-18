import { ThemedText } from '@/components/Atoms/ThemedText/ThemedText';
import { ThemedView } from '@/components/Atoms/ThemedView/ThemedView';
import { Post } from '@/components/Organisms/Post/Post';
import { useGetPosts } from '@/hooks/useGetPosts';
import { FeedHeader } from '@/screens/Feed/components/FeedHeader/FeedHeader';
import { useBreakpoint } from '@hooks/useBreakpoint';
import { usePostListManager } from '@hooks/usePostListManager';
import { useTheme } from '@hooks/useTheme';
import React, { useCallback } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Post as PostType } from '../../types/post.types';
import { createStyles } from './FeedScreen.styles';

/**
 * Feed screen that renders the main timeline with infinite scrolling.
 * Leverages shared list helpers to keep behavior consistent with MediaGrid.
 */
export const FeedScreen: React.FC = () => {
  const { theme } = useTheme();
  const { breakpoint } = useBreakpoint();
  const styles = createStyles(theme, breakpoint);
  const { posts, isLoading, isLoadingMore, error, hasMore, refresh, loadMore, toggleLike } =
    useGetPosts();
  const { handleEndReached, renderEmpty, renderFooter, viewabilityConfigCallbackPairs, isItemVisible } =
    usePostListManager({
      posts,
      isLoading,
      isLoadingMore,
      hasMore,
      error,
      refresh,
      loadMore,
      theme,
      styles,
    });

  const handleLike = useCallback((postId: string) => {
    toggleLike(postId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
        initialNumToRender={2}
        updateCellsBatchingPeriod={100}
      />
    </SafeAreaView>
  );
};
