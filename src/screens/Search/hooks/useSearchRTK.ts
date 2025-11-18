import { useGetPostsQuery, useLazySearchPostsQuery } from '@store/api/postsApi';
import { useEffect, useDeferredValue, useState } from 'react';
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

export const useSearchRTK = (): UseSearchRTKReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasInitialContent, setHasInitialContent] = useState(false);

  const [triggerSearch, {data: searchResults, isLoading, error: queryError}] =
    useLazySearchPostsQuery();

  // Load initial content (first page of posts) when no search query
  const {
    data: initialPostsData,
    isLoading: isLoadingInitial,
    error: initialError,
  } = useGetPostsQuery({page: 1, limit: 20}, {skip: deferredQuery.trim().length > 0});

  // Trigger search when deferred query changes
  useEffect(() => {
    if (deferredQuery.trim()) {
      triggerSearch({query: deferredQuery.trim()});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredQuery]);

  // Update posts when search results change
  useEffect(() => {
    if (searchResults && deferredQuery.trim()) {
      // Only update if we have a search query (search results are for search)
      setPosts(searchResults);
      setHasInitialContent(false);
    }
  }, [searchResults, deferredQuery]);

  // Load initial content when no search query
  useEffect(() => {
    if (!deferredQuery.trim()) {
      if (initialPostsData?.posts) {
        setPosts(initialPostsData.posts);
        setHasInitialContent(true);
      } else if (!isLoadingInitial) {
        // Only clear if we're not loading (to avoid flicker)
        setHasInitialContent(false);
      }
    }
  }, [deferredQuery, initialPostsData, isLoadingInitial]);

  // Extract media from posts and create mapping
  const {media, mediaToPostMap} = (() => {
    const mediaItems: MediaItem[] = [];
    const map = new Map<string, Post>();

    for (const post of posts) {
      for (const mediaItem of post.media) {
        mediaItems.push(mediaItem);
        map.set(mediaItem.id, post);
      }
    }

    return {media: mediaItems, mediaToPostMap: map};
  })();

  const search =(query: string) => {
    setSearchQuery(query);
  }

  const clearSearch = () => {
    setSearchQuery('');
    setHasInitialContent(false);
  };

  return {
    media,
    posts,
    mediaToPostMap,
    isLoading: isLoading || isLoadingInitial,
    error: (() => {
      if (queryError) {
        if (typeof queryError === 'string') {
          return new Error(queryError);
        }
        if ('error' in queryError) {
          return new Error(String(queryError.error));
        }
        return new Error('Search failed');
      }
      if (initialError) {
        if (typeof initialError === 'string') {
          return new Error(initialError);
        }
        if ('error' in initialError) {
          return new Error(String(initialError.error));
        }
        return new Error('Failed to load initial content');
      }
      return null;
    })(),
    hasInitialContent,
    search,
    clearSearch,
  };
};

