import { useGetPostsQuery, useToggleLikeMutation } from '@store/api/postsApi';
import { useEffect, useState } from 'react';
import type { Post } from '../types/post.types';

interface UseGetPostsReturn {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
  isFetching: boolean;
  toggleLike: (postId: string) => void;
}

/**
 * Hook for managing feed posts with RTK Query
 * Handles pagination and optimistic updates
 */
export const useGetPosts = (getLimit: number = 5): UseGetPostsReturn => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const {
    data: currentPageData,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useGetPostsQuery({ page, limit: getLimit }, { skip: false });

  const [toggleLikeMutation] = useToggleLikeMutation();

  // Update allPosts when new data arrives
  useEffect(() => {
    if (currentPageData) {
      if (page === 1) {
        // Reset posts for first page
        setAllPosts(currentPageData.posts);
      } else {
        // Append new posts, filtering out duplicates by ID
        setAllPosts(prev => {
          const existingIds = new Set(prev.map(post => post.id));
          const newPosts = currentPageData.posts.filter(post => !existingIds.has(post.id));
          return [...prev, ...newPosts];
        });
      }
    }
  }, [currentPageData, page]);

  const refresh = () => {
    setPage(1);
    setAllPosts([]);
    refetch();
  };

  const loadMore = () => {
    if (currentPageData?.hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  };

  const rollbackLike = (prevPosts: Post[], postId: string) => {
    return prevPosts.map(post =>
      post.id === postId
        ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes + 1 : post.likes - 1,
          }
        : post,
    );
  };

  const toggleLike = (postId: string) => {
    // Optimistic update
    setAllPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );

    // Call mutation (for future API integration)
    toggleLikeMutation({ postId }).catch(() => {
      // Rollback on error
      setAllPosts(prevPosts => rollbackLike(prevPosts, postId));
    });
  };

  // isLoading should be true during initial fetch OR when we're on page 1 and haven't received data yet
  // Keep loading true until we either have posts OR we've confirmed there are no posts
  const isInitialLoading = (() => {
    // If we're not on page 1 or we already have posts, not initial loading
    if (page !== 1 || allPosts.length > 0) {
      return false;
    }

    // If we're still fetching or loading, show loading
    if (isLoading || isFetching) {
      return true;
    }

    // If we have data with posts but they haven't been processed yet, show loading
    if (currentPageData !== undefined && currentPageData.posts.length > 0) {
      return true;
    }

    // If we've received an empty response (no posts), don't show loading
    if (
      currentPageData !== undefined &&
      currentPageData.posts?.length === 0 &&
      !isFetching &&
      !isLoading
    ) {
      return false;
    }

    // If we haven't received any data yet and no error, show loading
    if (currentPageData === undefined && !queryError) {
      return true;
    }

    // Default: don't show loading if we have an error
    return false;
  })();

  return {
    posts: allPosts,
    isLoading: isInitialLoading,
    isFetching,
    isLoadingMore: isFetching && page > 1,
    error: (() => {
      if (!queryError) {
        return null;
      }
      if (typeof queryError === 'string') {
        return new Error(queryError);
      }
      if ('error' in queryError) {
        return new Error(String(queryError.error));
      }
      return new Error('Failed to fetch posts');
    })(),
    hasMore: currentPageData?.hasMore ?? false,
    refresh,
    loadMore,
    toggleLike,
  };
};
