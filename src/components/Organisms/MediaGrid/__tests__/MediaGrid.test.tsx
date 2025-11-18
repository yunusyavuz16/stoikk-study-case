/**
 * Tests for MediaGrid component
 * Validates search filtering and pagination hooks
 */

import React from 'react';
import { act, waitFor } from '@testing-library/react-native';
import { ActivityIndicator, FlatList } from 'react-native';
import { PostSkeleton } from '@/components/Molecules/Skeleton/Skeleton';
import { MediaGrid } from '../MediaGrid';
import { renderWithProviders, createMockPost } from '../../../../__tests__/utils/testUtils';

const mockPrefetchImages = jest.fn();
const mockIsItemVisible = jest.fn(() => true);
const mockOnViewableItemsChanged = jest.fn();
const mockUseResponsiveColumns = jest.fn((_params?: { breakpoint: string }) => 3);
const mockRenderedMediaGridItem = jest.fn();

const mockUseGetPostsReturn = {
  posts: [createMockPost({ caption: 'Beach day' })],
  isLoading: false,
  isLoadingMore: false,
  error: null as Error | null,
  hasMore: false,
  refresh: jest.fn(),
  loadMore: jest.fn(),
};

jest.mock('@/hooks/useGetPosts', () => ({
  useGetPosts: () => mockUseGetPostsReturn,
}));

jest.mock('@hooks/useImagePrefetch', () => ({
  useImagePrefetch: () => ({ prefetchImages: mockPrefetchImages }),
}));

jest.mock('@hooks/useMediaPlayerVisibility', () => ({
  useMediaPlayerVisibility: () => ({
    onViewableItemsChanged: mockOnViewableItemsChanged,
    isItemVisible: mockIsItemVisible,
  }),
}));

jest.mock('@/screens/Search/hooks/useResponsiveColumns', () => ({
  useResponsiveColumns: (params: { breakpoint: string }) => mockUseResponsiveColumns(params),
}));

jest.mock('@hooks/useBreakpoint', () => ({
  useBreakpoint: () => ({
    width: 375,
    breakpoint: 'sm',
  }),
}));

jest.mock('@/components/Organisms/MediaGridItem/MediaGridItem', () => {
  const ReactModule = require('react');
  const { View } = require('react-native');

  return {
    MediaGridItem: (props: any) => {
      mockRenderedMediaGridItem(props);
      return ReactModule.createElement(View, { testID: `media-grid-item-${props.id}` });
    },
  };
});

describe('MediaGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetPostsReturn.posts = [createMockPost({ caption: 'Beach day' })];
    mockUseGetPostsReturn.isLoading = false;
    mockUseGetPostsReturn.isLoadingMore = false;
    mockUseGetPostsReturn.error = null;
    mockUseGetPostsReturn.hasMore = false;
    mockUseGetPostsReturn.refresh = jest.fn();
    mockUseGetPostsReturn.loadMore = jest.fn();
  });

  it('renders media items matching the search query', () => {
    mockUseGetPostsReturn.posts = [
      createMockPost({ id: 'post_1', caption: 'Beach day' }),
      createMockPost({ id: 'post_2', caption: 'City life' }),
    ];

    const { getAllByTestId } = renderWithProviders(<MediaGrid searchQuery="beach" />);

    expect(getAllByTestId(/media-grid-item-/)).toHaveLength(2);
  });

  it('renders feed empty state when no post matches search query', () => {
    mockUseGetPostsReturn.posts = [createMockPost({ caption: 'City life' })];

    const { getByText } = renderWithProviders(<MediaGrid searchQuery="forest" />);

    expect(getByText('No posts yet')).toBeTruthy();
  });

  it('calls loadMore when end is reached and more posts are available', () => {
    mockUseGetPostsReturn.hasMore = true;

    const { UNSAFE_getByType } = renderWithProviders(<MediaGrid searchQuery="" />);

    act(() => {
      UNSAFE_getByType(FlatList).props.onEndReached?.({ distanceFromEnd: 0 });
    });

    expect(mockUseGetPostsReturn.loadMore).toHaveBeenCalled();
  });

  it('prefetches images when posts are available', async () => {
    mockUseGetPostsReturn.posts = [createMockPost({ caption: 'Sunset vibes' })];

    renderWithProviders(<MediaGrid searchQuery="sunset" />);

    await waitFor(() => expect(mockPrefetchImages).toHaveBeenCalled());
  });

  it('renders post skeletons while initial data loads', () => {
    mockUseGetPostsReturn.posts = [];
    mockUseGetPostsReturn.isLoading = true;

    const { UNSAFE_getAllByType } = renderWithProviders(<MediaGrid searchQuery="" />);

    expect(UNSAFE_getAllByType(PostSkeleton)).toHaveLength(3);
  });

  it('shows an error empty state when data fetching fails', () => {
    const errorMessage = 'Network unavailable';
    mockUseGetPostsReturn.posts = [];
    mockUseGetPostsReturn.error = new Error(errorMessage);

    const { getByText } = renderWithProviders(<MediaGrid searchQuery="" />);

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('displays footer message when there are no more posts to fetch', () => {
    mockUseGetPostsReturn.posts = [createMockPost()];
    mockUseGetPostsReturn.hasMore = false;

    const { getByText } = renderWithProviders(<MediaGrid searchQuery="" />);

    expect(getByText('No more posts')).toBeTruthy();
  });

  it('shows loading indicator in footer while fetching more posts', () => {
    mockUseGetPostsReturn.posts = [createMockPost()];
    mockUseGetPostsReturn.hasMore = true;
    mockUseGetPostsReturn.isLoadingMore = true;

    const { UNSAFE_getByType } = renderWithProviders(<MediaGrid searchQuery="" />);

    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('calls refresh handler from the RefreshControl', () => {
    mockUseGetPostsReturn.refresh = jest.fn();

    const { UNSAFE_getByType } = renderWithProviders(<MediaGrid searchQuery="" />);

    act(() => {
      UNSAFE_getByType(FlatList).props.refreshControl.props.onRefresh();
    });

    expect(mockUseGetPostsReturn.refresh).toHaveBeenCalled();
  });

  it('passes item visibility state down to MediaGridItem', () => {
    mockIsItemVisible.mockReturnValueOnce(false).mockReturnValue(true);

    renderWithProviders(<MediaGrid searchQuery="" />);

    expect(mockRenderedMediaGridItem).toHaveBeenCalled();
    expect(mockRenderedMediaGridItem.mock.calls[0][0].isVisible).toBe(false);
  });
});
