/**
 * Tests for useFeedRTK hook
 * Covers feed post management, pagination, and like functionality
 */

import React from 'react';
import {renderHook, waitFor, act} from '@testing-library/react-native';
import {useFeedRTK} from '../useFeedRTK';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from '@contexts/ThemeContext';
import {createTestStore, defaultTestState, createMockPost} from '../../../../__tests__/utils/testUtils';

// Mock RTK Query hooks
const mockGetPostsQuery = jest.fn();
const mockToggleLikeMutation = jest.fn();

jest.mock('@store/api/postsApi', () => ({
  useGetPostsQuery: (params: any) => mockGetPostsQuery(params),
  useToggleLikeMutation: () => mockToggleLikeMutation(),
}));

describe('useFeedRTK', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockGetPostsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });
    mockToggleLikeMutation.mockReturnValue([
      jest.fn(() => Promise.resolve({unwrap: () => Promise.resolve()})),
      {isLoading: false},
    ]);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

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

  it('should return initial state', () => {
    const {result} = renderHook(() => useFeedRTK(), {wrapper: createWrapper()});

    expect(result.current.posts).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isLoadingMore).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasMore).toBe(false);
  });

  it('should load posts on first page', async () => {
    const mockPosts = [createMockPost({id: 'post_1'}), createMockPost({id: 'post_2'})];
    mockGetPostsQuery.mockReturnValue({
      data: {posts: mockPosts, hasMore: true, total: 20, currentPage: 1},
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });

    const {result} = renderHook(() => useFeedRTK(), {wrapper: createWrapper()});

    await waitFor(
      () => {
        expect(result.current.posts.length).toBeGreaterThan(0);
      },
      {timeout: 3000},
    );
  });

  it('should handle pagination', async () => {
    const page1Posts = [createMockPost({id: 'post_1'})];
    mockGetPostsQuery.mockReturnValue({
      data: {posts: page1Posts, hasMore: true, total: 20, currentPage: 1},
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });

    const {result} = renderHook(() => useFeedRTK(), {wrapper: createWrapper()});

    await waitFor(() => {
      expect(result.current.posts.length).toBe(1);
    });

    const page2Posts = [createMockPost({id: 'post_2'})];
    mockGetPostsQuery.mockReturnValue({
      data: {posts: page2Posts, hasMore: false, total: 20, currentPage: 2},
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false);
    });
  });

  it('should refresh posts', async () => {
    const mockPosts = [createMockPost({id: 'post_1'})];
    const mockRefetch = jest.fn();
    mockGetPostsQuery.mockReturnValue({
      data: {posts: mockPosts, hasMore: true, total: 20, currentPage: 1},
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: mockRefetch,
    });

    const {result} = renderHook(() => useFeedRTK(), {wrapper: createWrapper()});

    await waitFor(() => {
      expect(result.current.posts.length).toBe(1);
    });

    act(() => {
      result.current.refresh();
    });

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('should toggle like on post', async () => {
    const mockPosts = [createMockPost({id: 'post_1', isLiked: false, likes: 10})];
    const mockToggleLike = jest.fn(() => Promise.resolve({unwrap: () => Promise.resolve()}));
    mockGetPostsQuery.mockReturnValue({
      data: {posts: mockPosts, hasMore: false, total: 1, currentPage: 1},
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });
    mockToggleLikeMutation.mockReturnValue([mockToggleLike, {isLoading: false}]);

    const {result} = renderHook(() => useFeedRTK(), {wrapper: createWrapper()});

    await waitFor(() => {
      expect(result.current.posts.length).toBe(1);
    });

    act(() => {
      result.current.toggleLike('post_1');
    });

    expect(mockToggleLike).toHaveBeenCalledWith({postId: 'post_1'});
  });

  it('should handle errors', async () => {
    mockGetPostsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      error: {error: 'Failed to fetch'},
      refetch: jest.fn(),
    });

    const {result} = renderHook(() => useFeedRTK(), {wrapper: createWrapper()});

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });
});

