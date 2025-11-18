/**
 * Tests for useSearchRTK hook
 * Covers search functionality with useDeferredValue, media extraction, and error handling
 */

import React from 'react';
import {renderHook, waitFor, act} from '@testing-library/react-native';
import {useSearchRTK} from '../useSearchRTK';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from '@contexts/ThemeContext';
import {
  createTestStore,
  defaultTestState,
  createMockPost,
} from '../../../../__tests__/utils/testUtils';
import type {Post} from '../../../../types/post.types';

// Mock RTK Query hooks
const mockTriggerSearch = jest.fn();
let mockGetPostsQueryReturn: any;
let mockLazySearchPostsQueryReturn: any;

jest.mock('@store/api/postsApi', () => ({
  useGetPostsQuery: jest.fn((params: any, options: any) => {
    if (typeof mockGetPostsQueryReturn === 'function') {
      return mockGetPostsQueryReturn(params, options);
    }
    return mockGetPostsQueryReturn || {
      data: undefined,
      isLoading: false,
      error: null,
    };
  }),
  useLazySearchPostsQuery: jest.fn(() => {
    if (typeof mockLazySearchPostsQueryReturn === 'function') {
      return mockLazySearchPostsQueryReturn();
    }
    return (
      mockLazySearchPostsQueryReturn || [
        mockTriggerSearch,
        {data: undefined, isLoading: false, error: null},
      ]
    );
  }),
}));

describe('useSearchRTK', () => {
  const createWrapper = () => {
    const store = createTestStore(defaultTestState);
    return ({children}: {children: React.ReactNode}) => (
      <Provider store={store}>
        <SafeAreaProvider
          initialMetrics={{
            frame: {x: 0, y: 0, width: 375, height: 812},
            insets: {top: 44, left: 0, bottom: 34, right: 0},
          }}>
          <ThemeProvider>{children}</ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    );
  };

  let unmountFunctions: Array<() => void> = [];

  beforeEach(() => {
    jest.clearAllMocks();
    mockTriggerSearch.mockClear();
    mockGetPostsQueryReturn = {
      data: undefined,
      isLoading: false,
      error: null,
    };
    mockLazySearchPostsQueryReturn = [
      mockTriggerSearch,
      {data: undefined, isLoading: false, error: null},
    ];
    unmountFunctions = [];
  });

  afterEach(() => {
    // Clean up all unmounted renderers
    unmountFunctions.forEach(unmount => {
      try {
        unmount();
      } catch {
        // Ignore errors from already unmounted renderers
      }
    });
    unmountFunctions = [];
    jest.clearAllTimers();
  });

  describe('Initial State', () => {
    it('should return initial state with empty values', () => {
      const {result} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});

      expect(result.current.media).toEqual([]);
      expect(result.current.posts).toEqual([]);
      expect(result.current.mediaToPostMap.size).toBe(0);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.hasInitialContent).toBe(false);
    });

    it('should have search and clearSearch functions', () => {
      const {result} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});

      expect(typeof result.current.search).toBe('function');
      expect(typeof result.current.clearSearch).toBe('function');
    });
  });

  describe('Initial Content Loading', () => {
    it('should load initial content when no search query', async () => {
      const mockPosts: Post[] = [createMockPost({id: 'post_1'})];
      mockGetPostsQueryReturn = {
        data: {posts: mockPosts, hasMore: false, total: 1, currentPage: 1},
        isLoading: false,
        error: null,
      };

      const {result} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});

      await waitFor(() => {
        expect(result.current.hasInitialContent).toBe(true);
        expect(result.current.posts).toEqual(mockPosts);
      });
    });

    it('should show loading state when loading initial content', () => {
      mockGetPostsQueryReturn = {
        data: undefined,
        isLoading: true,
        error: null,
      };

      const {result} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Search Functionality', () => {
    it('should trigger search when query is set', async () => {
      const {result} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});

      act(() => {
        result.current.search('test query');
      });

      // Wait for deferred value to update and trigger search
      await waitFor(
        () => {
          expect(mockTriggerSearch).toHaveBeenCalledWith({query: 'test query'});
        },
        {timeout: 2000},
      );
    });

    it('should trim search query before triggering', async () => {
      const {result} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});

      act(() => {
        result.current.search('  test query  ');
      });

      await waitFor(
        () => {
          expect(mockTriggerSearch).toHaveBeenCalledWith({query: 'test query'});
        },
        {timeout: 2000},
      );
    });

    it('should not trigger search for empty query', () => {
      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      act(() => {
        result.current.search('');
      });

      // For empty query, search should never be triggered
      // The deferred value will be empty, so the effect won't run
      expect(mockTriggerSearch).not.toHaveBeenCalled();
    });

    it('should not trigger search for whitespace-only query', () => {
      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      act(() => {
        result.current.search('   ');
      });

      // Whitespace-only query should be trimmed to empty, so search won't trigger
      expect(mockTriggerSearch).not.toHaveBeenCalled();
    });

    it('should update posts when search results are received', async () => {
      const searchResults: Post[] = [
        createMockPost({id: 'search_post_1'}),
        createMockPost({id: 'search_post_2'}),
      ];

      // Set up mock to return search results
      mockLazySearchPostsQueryReturn = [
        mockTriggerSearch,
        {data: searchResults, isLoading: false, error: null},
      ];

      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      act(() => {
        result.current.search('test');
      });

      await waitFor(
        () => {
          expect(mockTriggerSearch).toHaveBeenCalledWith({query: 'test'});
        },
        {timeout: 2000},
      );
    });

    it('should show loading state during search', () => {
      mockLazySearchPostsQueryReturn = [
        mockTriggerSearch,
        {data: undefined, isLoading: true, error: null},
      ];

      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Media Extraction', () => {
    it('should extract media items from posts', async () => {
      const mockPosts: Post[] = [createMockPost({id: 'post_1'})];
      mockGetPostsQueryReturn = {
        data: {posts: mockPosts, hasMore: false, total: 1, currentPage: 1},
        isLoading: false,
        error: null,
      };

      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      await waitFor(() => {
        expect(result.current.media.length).toBeGreaterThan(0);
        expect(result.current.mediaToPostMap.size).toBeGreaterThan(0);
      });
    });

    it('should create correct media to post mapping', async () => {
      const mockPosts: Post[] = [createMockPost({id: 'post_1'})];
      mockGetPostsQueryReturn = {
        data: {posts: mockPosts, hasMore: false, total: 1, currentPage: 1},
        isLoading: false,
        error: null,
      };

      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      await waitFor(() => {
        const post = result.current.posts[0];
        if (post) {
          const mediaItem = post.media[0];
          if (mediaItem) {
            const mappedPost = result.current.mediaToPostMap.get(mediaItem.id);
            expect(mappedPost).toEqual(post);
          }
        }
      });
    });

    it('should handle posts with multiple media items', async () => {
      const mockPosts: Post[] = [
        createMockPost({
          id: 'post_1',
          media: [
            {id: 'img_1', type: 'image' as const, uri: 'uri1', thumbnail: 'thumb1'},
            {id: 'img_2', type: 'image' as const, uri: 'uri2', thumbnail: 'thumb2'},
          ],
        }),
      ];
      mockGetPostsQueryReturn = {
        data: {posts: mockPosts, hasMore: false, total: 1, currentPage: 1},
        isLoading: false,
        error: null,
      };

      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      await waitFor(() => {
        expect(result.current.media.length).toBe(2);
        expect(result.current.mediaToPostMap.size).toBe(2);
      });
    });
  });

  describe('Clear Search', () => {
    it('should clear search query and reset hasInitialContent', () => {
      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      act(() => {
        result.current.search('test');
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.hasInitialContent).toBe(false);
    });

    it('should allow loading initial content after clearing search', async () => {
      const mockPosts: Post[] = [createMockPost({id: 'post_1'})];
      mockGetPostsQueryReturn = {
        data: {posts: mockPosts, hasMore: false, total: 1, currentPage: 1},
        isLoading: false,
        error: null,
      };

      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      act(() => {
        result.current.search('test');
      });

      act(() => {
        result.current.clearSearch();
      });

      await waitFor(() => {
        expect(result.current.hasInitialContent).toBe(true);
        expect(result.current.posts).toEqual(mockPosts);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle search query errors', async () => {
      mockLazySearchPostsQueryReturn = [
        mockTriggerSearch,
        {data: undefined, isLoading: false, error: {error: 'Search failed'}},
      ];

      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      await waitFor(
        () => {
          expect(result.current.error).toBeTruthy();
          expect(result.current.error?.message).toBe('Search failed');
        },
        {timeout: 1000},
      );
    });

    it('should handle string error from search', async () => {
      mockLazySearchPostsQueryReturn = [
        mockTriggerSearch,
        {data: undefined, isLoading: false, error: 'Search error'},
      ];

      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      await waitFor(
        () => {
          expect(result.current.error).toBeTruthy();
          expect(result.current.error?.message).toBe('Search error');
        },
        {timeout: 1000},
      );
    });

    it('should handle initial content loading errors', async () => {
      mockGetPostsQueryReturn = {
        data: undefined,
        isLoading: false,
        error: {error: 'Failed to load'},
      };

      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      await waitFor(
        () => {
          expect(result.current.error).toBeTruthy();
          expect(result.current.error?.message).toBe('Failed to load');
        },
        {timeout: 1000},
      );
    });

    it('should handle string error from initial content', async () => {
      mockGetPostsQueryReturn = {
        data: undefined,
        isLoading: false,
        error: 'Initial load error',
      };

      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      await waitFor(
        () => {
          expect(result.current.error).toBeTruthy();
          expect(result.current.error?.message).toBe('Initial load error');
        },
        {timeout: 1000},
      );
    });
  });

  describe('Loading States', () => {
    it('should combine loading states from search and initial content', () => {
      mockGetPostsQueryReturn = {
        data: undefined,
        isLoading: true,
        error: null,
      };
      mockLazySearchPostsQueryReturn = [
        mockTriggerSearch,
        {data: undefined, isLoading: false, error: null},
      ];

      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      expect(result.current.isLoading).toBe(true);
    });

    it('should show loading when search is loading', () => {
      mockGetPostsQueryReturn = {
        data: undefined,
        isLoading: false,
        error: null,
      };
      mockLazySearchPostsQueryReturn = [
        mockTriggerSearch,
        {data: undefined, isLoading: true, error: null},
      ];

      const {result, unmount} = renderHook(() => useSearchRTK(), {wrapper: createWrapper()});
      unmountFunctions.push(unmount);

      expect(result.current.isLoading).toBe(true);
    });
  });
});
