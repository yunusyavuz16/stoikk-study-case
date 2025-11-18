/**
 * Tests for useImagePrefetch hook
 * Covers image prefetching functionality
 */

import {renderHook} from '@testing-library/react-native';
import {useImagePrefetch} from '../useImagePrefetch';
import {imageCacheService, CachePriority} from '@services/imageCacheService';

jest.mock('@services/imageCacheService', () => ({
  imageCacheService: {
    prefetchImage: jest.fn(),
    prefetchImages: jest.fn(),
    isPrefetched: jest.fn(() => false),
    isThumbnailPrefetched: jest.fn(() => false),
  },
  CachePriority: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
  },
}));

describe('useImagePrefetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should prefetch single image', () => {
    const {result} = renderHook(() => useImagePrefetch());

    result.current.prefetchImage('https://example.com/image.jpg');

    expect(imageCacheService.prefetchImage).toHaveBeenCalledWith(
      'https://example.com/image.jpg',
      undefined,
      CachePriority.NORMAL,
    );
  });

  it('should prefetch image with thumbnail', () => {
    const {result} = renderHook(() => useImagePrefetch());

    result.current.prefetchImage('https://example.com/image.jpg', 'https://example.com/thumb.jpg');

    expect(imageCacheService.prefetchImage).toHaveBeenCalledWith(
      'https://example.com/image.jpg',
      'https://example.com/thumb.jpg',
      CachePriority.NORMAL,
    );
  });

  it('should prefetch image with custom priority', () => {
    const {result} = renderHook(() => useImagePrefetch());

    result.current.prefetchImage('https://example.com/image.jpg', undefined, CachePriority.HIGH);

    expect(imageCacheService.prefetchImage).toHaveBeenCalledWith(
      'https://example.com/image.jpg',
      undefined,
      CachePriority.HIGH,
    );
  });

  it('should prefetch multiple images', () => {
    const {result} = renderHook(() => useImagePrefetch());

    const items = [
      {uri: 'https://example.com/image1.jpg', thumbnailUri: 'https://example.com/thumb1.jpg'},
      {uri: 'https://example.com/image2.jpg'},
    ];

    result.current.prefetchImages(items);

    expect(imageCacheService.prefetchImages).toHaveBeenCalledWith(items, CachePriority.NORMAL);
  });

  it('should check if image is prefetched', () => {
    const {result} = renderHook(() => useImagePrefetch());

    result.current.isPrefetched('https://example.com/image.jpg');

    expect(imageCacheService.isPrefetched).toHaveBeenCalledWith('https://example.com/image.jpg');
  });

  it('should check if thumbnail is prefetched', () => {
    const {result} = renderHook(() => useImagePrefetch());

    result.current.isThumbnailPrefetched('https://example.com/thumb.jpg');

    expect(imageCacheService.isThumbnailPrefetched).toHaveBeenCalledWith('https://example.com/thumb.jpg');
  });
});

