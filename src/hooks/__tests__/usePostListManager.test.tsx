/**
 * Tests for usePostListManager hook
 * Validates pagination helpers, render callbacks, and media prefetching
 */

import React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {usePostListManager} from '../usePostListManager';
import * as imagePrefetchHook from '../useImagePrefetch';
import * as mediaVisibilityHook from '../useMediaPlayerVisibility';
import {createTheme} from '@styles/theme';
import type {Post} from '@/types/post.types';

jest.mock('@/components/Atoms/ThemedText/ThemedText', () => {
  const ReactModule = require('react');
  const ThemedText = ({children, ...rest}: any) =>
    ReactModule.createElement('ThemedTextMock', rest, children);
  return {ThemedText};
});

jest.mock('@/components/Atoms/ThemedView/ThemedView', () => {
  const ReactModule = require('react');
  const ThemedView = ({children, ...rest}: any) =>
    ReactModule.createElement('ThemedViewMock', rest, children);
  return {ThemedView};
});

jest.mock('@/components/Molecules/EmptyState/EmptyState', () => {
  const ReactModule = require('react');
  const EmptyState = (props: any) => ReactModule.createElement('EmptyStateMock', props);
  return {EmptyState};
});

jest.mock('@/components/Molecules/Skeleton/Skeleton', () => {
  const ReactModule = require('react');
  const PostSkeleton = (props: any) => ReactModule.createElement('PostSkeletonMock', props);
  return {PostSkeleton};
});

type HookParams = Parameters<typeof usePostListManager>[0];

const theme = createTheme('light');

const styles = {
  endMessage: {padding: 8},
  endMessageText: {fontSize: 14},
  footerLoader: {padding: 16},
  emptyContainer: {padding: 12},
};

const createPost = (overrides: Partial<Post> = {}): Post => ({
  id: overrides.id ?? 'post_1',
  userId: overrides.userId ?? 'user_1',
  username: overrides.username ?? 'john',
  type: overrides.type ?? 'images',
  media:
    overrides.media ??
    [
      {
        id: 'media_1',
        type: 'image',
        uri: 'https://example.com/image-1.jpg',
        thumbnail: 'https://example.com/thumb-1.jpg',
      },
    ],
  caption: overrides.caption ?? 'caption',
  likes: overrides.likes ?? 10,
  comments: overrides.comments ?? 2,
  timestamp: overrides.timestamp ?? 1_700_000_000_000,
  isLiked: overrides.isLiked ?? false,
});

const buildProps = (overrides: Partial<HookParams> = {}): HookParams => ({
  posts: [],
  isLoadingMore: false,
  hasMore: true,
  loadMore: jest.fn(),
  theme,
  styles,
  ...overrides,
});

type AnyElement = React.ReactElement<Record<string, unknown>>;

describe('usePostListManager', () => {
  const mockPrefetchImages = jest.fn();
  const mockMediaVisibility = {
    onViewableItemsChanged: jest.fn(),
    isItemVisible: jest.fn().mockReturnValue(false),
    visibleItems: new Set<number>(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(imagePrefetchHook, 'useImagePrefetch').mockReturnValue({
      prefetchImages: mockPrefetchImages,
      prefetchImage: jest.fn(),
      isPrefetched: jest.fn(),
      isThumbnailPrefetched: jest.fn(),
    });

    jest.spyOn(mediaVisibilityHook, 'useMediaPlayerVisibility').mockReturnValue({
      onViewableItemsChanged: mockMediaVisibility.onViewableItemsChanged,
      isItemVisible: mockMediaVisibility.isItemVisible,
      visibleItems: mockMediaVisibility.visibleItems,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should call loadMore when more posts are available', () => {
    const loadMore = jest.fn();
    const {result} = renderHook(() =>
      usePostListManager(
        buildProps({
          loadMore,
          hasMore: true,
          isLoadingMore: false,
        }),
      ),
    );

    act(() => {
      result.current.handleEndReached();
    });

    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it('should not call loadMore when already loading more', () => {
    const loadMore = jest.fn();
    const {result} = renderHook(() =>
      usePostListManager(
        buildProps({
          loadMore,
          hasMore: true,
          isLoadingMore: true,
        }),
      ),
    );

    act(() => {
      result.current.handleEndReached();
    });

    expect(loadMore).not.toHaveBeenCalled();
  });

  it('should not call loadMore when no more posts are available', () => {
    const loadMore = jest.fn();
    const {result} = renderHook(() =>
      usePostListManager(
        buildProps({
          loadMore,
          hasMore: false,
        }),
      ),
    );

    act(() => {
      result.current.handleEndReached();
    });

    expect(loadMore).not.toHaveBeenCalled();
  });

  it('should render end message when feed is exhausted', () => {
    const posts = [createPost({id: 'post_1'})];
    const {result} = renderHook(() =>
      usePostListManager(
        buildProps({
          posts,
          hasMore: false,
        }),
      ),
    );

    const footer = result.current.renderFooter();
    expect(footer).not.toBeNull();
    if (!footer) {
      throw new Error('Expected footer element');
    }

    const footerElement = footer as AnyElement;
    const footerText = footerElement.props.children as AnyElement;
    expect(footerText.props.children).toBe('No more posts');
  });

  it('should render loader when loading more posts', () => {
    const {result} = renderHook(() =>
      usePostListManager(
        buildProps({
          isLoadingMore: true,
        }),
      ),
    );

    const footer = result.current.renderFooter();
    expect(footer).not.toBeNull();
    if (!footer) {
      throw new Error('Expected footer element');
    }

    const footerElement = footer as AnyElement;
    const loader = footerElement.props.children as AnyElement;
    const loaderType = (loader.type as {displayName?: string; name?: string}) ?? {};
    expect(loaderType.displayName ?? loaderType.name).toBe('ActivityIndicator');
  });

  it('should return null footer when idle with more posts available', () => {
    const {result} = renderHook(() => usePostListManager(buildProps()));
    expect(result.current.renderFooter()).toBeNull();
  });

  it('should prefetch limited number of posts by default', async () => {
    const posts = [
      createPost({
        id: 'post_1',
        media: [
          {id: 'img_1', type: 'image', uri: 'https://example.com/img-1.jpg', thumbnail: 'thumb-1'},
          {id: 'vid_1', type: 'video', uri: 'video://1'},
        ],
      }),
      createPost({
        id: 'post_2',
        media: [{id: 'img_2', type: 'image', uri: 'https://example.com/img-2.jpg', thumbnail: 'thumb-2'}],
      }),
    ];

    renderHook(() =>
      usePostListManager(
        buildProps({
          posts,
          prefetchCount: 1,
          prefetchStrategy: 'limited',
        }),
      ),
    );

    await waitFor(() => {
      expect(mockPrefetchImages).toHaveBeenCalledWith([
        {uri: 'https://example.com/img-1.jpg', thumbnailUri: 'thumb-1'},
      ]);
    });
  });

  it('should skip prefetching when there are no posts', async () => {
    renderHook(() =>
      usePostListManager(
        buildProps({
          posts: [],
        }),
      ),
    );

    await waitFor(() => {
      expect(mockPrefetchImages).not.toHaveBeenCalled();
    });
  });

  it('should not prefetch when posts only contain videos', async () => {
    const posts = [
      createPost({
        id: 'post-video',
        media: [
          {id: 'vid_1', type: 'video', uri: 'video://1', thumbnail: 'thumb-video-1'},
          {id: 'vid_2', type: 'video', uri: 'video://2', thumbnail: 'thumb-video-2'},
        ],
      }),
    ];

    renderHook(() =>
      usePostListManager(
        buildProps({
          posts,
          prefetchStrategy: 'all',
        }),
      ),
    );

    await waitFor(() => {
      expect(mockPrefetchImages).not.toHaveBeenCalled();
    });
  });

  it('should prefetch all posts when strategy is set to all', async () => {
    const posts = [
      createPost({
        id: 'post_1',
        media: [{id: 'img_1', type: 'image', uri: 'https://example.com/img-1.jpg', thumbnail: 'thumb-1'}],
      }),
      createPost({
        id: 'post_2',
        media: [{id: 'img_2', type: 'image', uri: 'https://example.com/img-2.jpg', thumbnail: 'thumb-2'}],
      }),
    ];

    renderHook(() =>
      usePostListManager(
        buildProps({
          posts,
          prefetchStrategy: 'all',
        }),
      ),
    );

    await waitFor(() => {
      expect(mockPrefetchImages).toHaveBeenCalledWith([
        {uri: 'https://example.com/img-1.jpg', thumbnailUri: 'thumb-1'},
        {uri: 'https://example.com/img-2.jpg', thumbnailUri: 'thumb-2'},
      ]);
    });
  });

  it('should expose viewability callbacks from visibility hook', () => {
    const {result} = renderHook(() => usePostListManager(buildProps()));

    expect(result.current.viewabilityConfigCallbackPairs[0].onViewableItemsChanged).toBe(
      mockMediaVisibility.onViewableItemsChanged,
    );
    expect(result.current.isItemVisible).toBe(mockMediaVisibility.isItemVisible);
  });
});


