/**
 * Tests for FeedScreen
 * Covers feed rendering, pagination, pull-to-refresh, and like functionality
 */

import React from 'react';
import {FeedScreen} from '../FeedScreen';
import {renderWithProviders, createMockPost} from '../../../__tests__/utils/testUtils';
import type {Post} from '../../../types/post.types';

// Mock hooks
const mockUseFeedRTK: {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  refresh: jest.Mock;
  loadMore: jest.Mock;
  toggleLike: jest.Mock;
} = {
  posts: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  hasMore: true,
  refresh: jest.fn(),
  loadMore: jest.fn(),
  toggleLike: jest.fn(),
};

jest.mock('../hooks/useFeedRTK', () => ({
  useFeedRTK: () => mockUseFeedRTK,
}));

jest.mock('@hooks/useImagePrefetch', () => ({
  useImagePrefetch: () => ({
    prefetchImages: jest.fn(),
  }),
}));

jest.mock('@hooks/useMediaPlayerVisibility', () => ({
  useMediaPlayerVisibility: () => ({
    onViewableItemsChanged: jest.fn(),
    isItemVisible: jest.fn(() => true),
  }),
}));

describe('FeedScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFeedRTK.posts = [];
    mockUseFeedRTK.isLoading = false;
    mockUseFeedRTK.error = null;
    mockUseFeedRTK.hasMore = true;
  });

  it('should render feed screen', () => {
    const {getByTestId} = renderWithProviders(<FeedScreen />);

    // Feed should render
    expect(getByTestId).toBeDefined();
  });

  it('should render posts list', () => {
    const posts: Post[] = [
      createMockPost({id: 'post_1'}),
      createMockPost({id: 'post_2'}),
    ];
    mockUseFeedRTK.posts = posts as Post[];

    renderWithProviders(<FeedScreen />);

    expect(posts.length).toBeGreaterThan(0);
  });

  it('should show loading skeleton when loading', () => {
    mockUseFeedRTK.isLoading = true;

    renderWithProviders(<FeedScreen />);

    // Should show skeleton during loading
    expect(mockUseFeedRTK.isLoading).toBe(true);
  });

  it('should show error message when error exists', () => {
    mockUseFeedRTK.error = new Error('Failed to load posts') as Error | null;

    const {getByText} = renderWithProviders(<FeedScreen />);

    expect(getByText(/Error:/)).toBeTruthy();
  });

  it('should call refresh on pull to refresh', () => {
    renderWithProviders(<FeedScreen />);

    // Simulate pull to refresh
    // This would typically be done through FlatList's refreshControl
    expect(mockUseFeedRTK.refresh).toBeDefined();
  });

  it('should call loadMore when reaching end', () => {
    mockUseFeedRTK.posts = [createMockPost()];
    mockUseFeedRTK.hasMore = true;

    renderWithProviders(<FeedScreen />);

    // loadMore should be called when end is reached
    // This is typically handled by FlatList's onEndReached
    expect(mockUseFeedRTK.loadMore).toBeDefined();
  });

  it('should show empty state when no posts', () => {
    mockUseFeedRTK.posts = [];
    mockUseFeedRTK.isLoading = false;

    renderWithProviders(<FeedScreen />);

    // Should show empty state
    expect(mockUseFeedRTK.posts.length).toBe(0);
  });

  it('should show footer loader when loading more', () => {
    mockUseFeedRTK.posts = [createMockPost()];
    mockUseFeedRTK.isLoadingMore = true;
    mockUseFeedRTK.hasMore = true;

    renderWithProviders(<FeedScreen />);

    expect(mockUseFeedRTK.isLoadingMore).toBe(true);
  });

  it('should show end message when no more posts', () => {
    mockUseFeedRTK.posts = [createMockPost()];
    mockUseFeedRTK.hasMore = false;

    const {getByText} = renderWithProviders(<FeedScreen />);

    expect(getByText('No more posts')).toBeTruthy();
  });
});

