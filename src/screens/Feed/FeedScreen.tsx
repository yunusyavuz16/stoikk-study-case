import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Post } from '@components/Post/Post';
import { SearchBar } from '@components/SearchBar/SearchBar';
import { Icon } from '@components/Icon/Icon';
import { EmptyState } from '@components/EmptyState/EmptyState';
import { ICONS } from '@constants/icons.constants';
import { useFeedRTK } from '@hooks/useFeedRTK';
import { useImagePrefetch } from '@hooks/useImagePrefetch';
import { useMediaPlayerVisibility } from '@hooks/useMediaPlayerVisibility';
import { PostSkeleton } from '@components/Skeleton/Skeleton';
import { styles } from './FeedScreen.styles';
import type { RootStackParamList } from '../../navigation/types';
import { theme } from '@styles/theme';
import type { Post as PostType } from '../../types/post.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Feed screen displaying posts in a scrollable list with infinite scroll
 * with memory optimization to prevent OOM crashes
 */
export const FeedScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { posts, isLoading, isLoadingMore, error, hasMore, refresh, loadMore, toggleLike } =
    useFeedRTK();
  const { prefetchImages } = useImagePrefetch();
  const { onViewableItemsChanged, isItemVisible } = useMediaPlayerVisibility(50);
  const [searchQuery, setSearchQuery] = useState('');

  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 200,
  });

  const handleSearchFocus = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  const handleLike = useCallback(
    (postId: string) => {
      toggleLike(postId);
    },
    [toggleLike],
  );

  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, loadMore]);

  // Prefetch next posts' media when scrolling
  useEffect(() => {
    if (posts.length > 0) {
      const nextPosts = posts.slice(0, 5); // Prefetch first 5 posts
      const mediaUris = nextPosts.flatMap(post =>
        post.media.filter(m => m.type === 'image').map(m => m.uri),
      );
      if (mediaUris.length > 0) {
        prefetchImages(mediaUris);
      }
    }
  }, [posts, prefetchImages]);

  const renderPost = useCallback(
    ({ item, index }: { item: PostType; index: number }) => {
      // Pause videos for posts that are not visible (memory optimization)
      const isVisible = isItemVisible(index);
      return <Post post={item} onLike={handleLike} isVisible={isVisible} />;
    },
    [handleLike, isItemVisible],
  );

  const keyExtractor = useCallback((item: PostType, index: number) => {
    // Use post ID as key - deduplication in useFeedRTK ensures uniqueness
    // Fallback to index only if ID is missing (should never happen)
    if (!item?.id) {
      console.warn(`Post at index ${index} missing ID, using fallback key`);
      return `post_fallback_${index}`;
    }
    return item.id;
  }, []);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) {
      return null;
    }
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [isLoadingMore]);

  const renderEmpty = useCallback(() => {
    // Show loading skeleton during initial load
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          {Array.from({ length: 3 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </View>
      );
    }
    if (error) {
      return <EmptyState type="network" message={error.message} onRetry={refresh} />;
    }
    // Only show "no posts yet" when loading is complete and there are no posts
    return <EmptyState type="feed" />;
  }, [isLoading, error, refresh]);

  const renderEndMessage = useCallback(() => {
    if (!hasMore && posts.length > 0) {
      return (
        <View style={styles.endMessage}>
          <Text style={styles.endMessageText}>No more posts</Text>
        </View>
      );
    }
    return null;
  }, [hasMore, posts.length]);

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: viewabilityConfigRef.current,
      onViewableItemsChanged,
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            placeholder="Search"
          />
        </View>
        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.profileButton}
          accessibilityLabel="Go to profile"
          accessibilityRole="button">
          <Icon name={ICONS.PROFILE} size={24} color={theme.colors.text} family="Ionicons" />
        </TouchableOpacity>
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
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
      {renderEndMessage()}
    </SafeAreaView>
  );
};
