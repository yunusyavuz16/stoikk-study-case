import { EmptyState } from '@components/EmptyState/EmptyState';
import { Icon } from '@components/Icon/Icon';
import { Post } from '@components/Post/Post';
import { SearchBar } from '@components/SearchBar/SearchBar';
import { PostSkeleton } from '@components/Skeleton/Skeleton';
import { ThemedText } from '@components/ThemedText/ThemedText';
import { ThemedView } from '@components/ThemedView/ThemedView';
import { ICONS } from '@constants/icons.constants';
import { useFeedRTK } from '@hooks/useFeedRTK';
import { useImagePrefetch } from '@hooks/useImagePrefetch';
import { useMediaPlayerVisibility } from '@hooks/useMediaPlayerVisibility';
import { useTheme } from '@hooks/useTheme';
import { useBreakpoint } from '@hooks/useBreakpoint';
import { getResponsiveSpacing } from '@styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../navigation/types';
import type { Post as PostType } from '../../types/post.types';
import { createStyles } from './FeedScreen.styles';

/**
 * Feed screen displaying posts in a scrollable list with infinite scroll
 * with memory optimization to prevent OOM crashes
 */
export const FeedScreen: React.FC = () => {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const { breakpoint, isTablet } = useBreakpoint();
  const styles = createStyles(theme, breakpoint);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { posts, isLoading, isLoadingMore, error, hasMore, refresh, loadMore, toggleLike } =
    useFeedRTK();
  const { prefetchImages } = useImagePrefetch();
  const { onViewableItemsChanged, isItemVisible } = useMediaPlayerVisibility(50);

  // Tablet optimization: Use 2-3 column layout for tablets
  const numColumns = useMemo(() => {
    if (!isTablet) return 1; // Single column for phones
    if (breakpoint === 'xl' || breakpoint === 'lg') return 3; // 3 columns for large tablets
    return 2; // 2 columns for medium tablets
  }, [isTablet, breakpoint]);

  // Calculate post width for multi-column layout
  const postWidth = useMemo(() => {
    if (numColumns === 1) return undefined; // Let it use full width
    // For multi-column: calculate width with gaps
    // Container already has padding, so we use screenWidth directly
    // Subtract gaps between columns
    const gap = getResponsiveSpacing('md', breakpoint);
    const totalGaps = gap * (numColumns - 1);
    const containerPadding = getResponsiveSpacing('md', breakpoint) * 2;
    const availableWidth = screenWidth - containerPadding;
    return (availableWidth - totalGaps) / numColumns;
  }, [numColumns, screenWidth, breakpoint]);

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

  // Prefetch next posts' media when scrolling (with thumbnails)
  useEffect(() => {
    if (posts.length > 0) {
      const nextPosts = posts.slice(0, 5); // Prefetch first 5 posts
      const mediaItems = nextPosts.flatMap(post =>
        post.media
          .filter(m => m.type === 'image')
          .map(m => ({uri: m.uri, thumbnailUri: m.thumbnail})),
      );
      if (mediaItems.length > 0) {
        prefetchImages(mediaItems);
      }
    }
  }, [posts, prefetchImages]);

  const renderPost = useCallback(
    ({ item, index }: { item: PostType; index: number }) => {
      // Pause videos for posts that are not visible (memory optimization)
      const isVisible = isItemVisible(index);
      return (
        <View style={numColumns > 1 ? { width: postWidth } : undefined}>
          <Post post={item} onLike={handleLike} isVisible={isVisible} />
        </View>
      );
    },
    [handleLike, isItemVisible, numColumns, postWidth],
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
      <ThemedView style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </ThemedView>
    );
  }, [isLoadingMore, theme.colors.primary, styles.footerLoader]);

  const renderEmpty = useCallback(() => {
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
  }, [isLoading, error, refresh, styles.emptyContainer]);

  const renderEndMessage = useCallback(() => {
    if (!hasMore && posts.length > 0) {
      return (
        <ThemedView style={styles.endMessage}>
          <ThemedText style={styles.endMessageText}>No more posts</ThemedText>
        </ThemedView>
      );
    }
    return null;
  }, [hasMore, posts.length, styles.endMessage, styles.endMessageText]);

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: viewabilityConfigRef.current,
      onViewableItemsChanged,
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.searchBarContainer}
          onPress={handleSearchFocus}
          activeOpacity={1}
          accessibilityLabel="Go to search"
          accessibilityRole="button">
          <View pointerEvents="none" style={{flex: 1}}>
            <SearchBar
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.profileButton}
          accessibilityLabel="Go to profile"
          accessibilityRole="button">
          <Icon name={ICONS.PROFILE} size={24} color={theme.colors.text} family="Ionicons" />
        </TouchableOpacity>
      </ThemedView>
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
        // Tablet optimization: multi-column layout
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
      />
      {renderEndMessage()}
    </SafeAreaView>
  );
};
