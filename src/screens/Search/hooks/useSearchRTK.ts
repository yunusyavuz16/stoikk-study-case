import { useGetPostsQuery, useLazySearchPostsQuery } from '@store/api/postsApi';
import { useEffect, useState } from 'react';
import type { MediaItem, Post } from '../../../types/post.types';

interface UseSearchRTKReturn {
  media: MediaItem[];
  posts: Post[];
  mediaToPostMap: Map<string, Post>;
  isLoading: boolean;
  error: Error | null;
  hasInitialContent: boolean;
  search: (query: string) => void;
  clearSearch: () => void;
}

/**
 * Hook for managing search functionality with RTK Query
 * Uses debouncing and extracts media from matching posts
 * Loads initial content when no search query is present
 */
export const useSearchRTK = (): UseSearchRTKReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasInitialContent, setHasInitialContent] = useState(false);

  const [triggerSearch, {data: searchResults, isLoading, error: queryError}] =
    useLazySearchPostsQuery();

  // Load initial content (first page of posts) when no search query
  const {
    data: initialPostsData,
    isLoading: isLoadingInitial,
    error: initialError,
  } = useGetPostsQuery({page: 1, limit: 20}, {skip: debouncedQuery.trim().length > 0});

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      triggerSearch({query: debouncedQuery.trim()});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  // Update posts when search results change
  useEffect(() => {
    if (searchResults && debouncedQuery.trim()) {
      // Only update if we have a search query (search results are for search)
      setPosts(searchResults);
      setHasInitialContent(false);
    }
  }, [searchResults, debouncedQuery]);

  // Load initial content when no search query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      if (initialPostsData?.posts) {
        setPosts(initialPostsData.posts);
        setHasInitialContent(true);
      } else if (!isLoadingInitial) {
        // Only clear if we're not loading (to avoid flicker)
        setHasInitialContent(false);
      }
    }
  }, [debouncedQuery, initialPostsData, isLoadingInitial]);

  // Extract media from posts and create mapping
  const {media, mediaToPostMap} = (() => {
    const mediaItems: MediaItem[] = [];
    const map = new Map<string, Post>();

    posts.forEach(post => {
      post.media.forEach(mediaItem => {
        mediaItems.push(mediaItem);
        map.set(mediaItem.id, post);
      });
    });

    return {media: mediaItems, mediaToPostMap: map};
  })();

  const search =(query: string) => {
    setSearchQuery(query);
  }

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    // Posts will be set by the initial content effect
    setHasInitialContent(false);
  };

  return {
    media,
    posts,
    mediaToPostMap,
    isLoading: isLoading || isLoadingInitial,
    error: queryError
      ? new Error(
          typeof queryError === 'string'
            ? queryError
            : 'error' in queryError
              ? String(queryError.error)
              : 'Search failed',
        )
      : initialError
        ? new Error(
            typeof initialError === 'string'
              ? initialError
              : 'error' in initialError
                ? String(initialError.error)
                : 'Failed to load initial content',
          )
        : null,
    hasInitialContent,
    search,
    clearSearch,
  };
};

