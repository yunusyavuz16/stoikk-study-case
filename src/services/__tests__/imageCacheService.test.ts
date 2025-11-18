/**
 * Tests for ImageCacheService
 * Covers image prefetching, cache management, and tracking
 */

import {imageCacheService, CachePriority} from '../imageCacheService';
import FastImage from 'react-native-fast-image';

jest.mock('react-native-fast-image', () => ({
  __esModule: true,
  default: {
    preload: jest.fn(() => Promise.resolve()),
    clearDiskCache: jest.fn(() => Promise.resolve()),
    clearMemoryCache: jest.fn(() => Promise.resolve()),
    priority: {
      low: 'low',
      normal: 'normal',
      high: 'high',
    },
  },
}));

describe('ImageCacheService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    imageCacheService.clearPrefetchTracking();
  });

  describe('prefetchImage', () => {
    it('should prefetch a single image', () => {
      const uri = 'https://example.com/image.jpg';
      imageCacheService.prefetchImage(uri);

      expect(FastImage.preload).toHaveBeenCalled();
    });

    it('should prefetch image with thumbnail', () => {
      const uri = 'https://example.com/image.jpg';
      const thumbnailUri = 'https://example.com/thumb.jpg';
      imageCacheService.prefetchImage(uri, thumbnailUri);

      expect(FastImage.preload).toHaveBeenCalledTimes(2);
    });

    it('should not prefetch the same image twice', () => {
      const uri = 'https://example.com/image.jpg';
      imageCacheService.prefetchImage(uri);
      imageCacheService.prefetchImage(uri);

      expect(FastImage.preload).toHaveBeenCalledTimes(1);
    });

    it('should handle different priority levels', () => {
      const uri = 'https://example.com/image.jpg';
      imageCacheService.prefetchImage(uri, undefined, CachePriority.HIGH);
      imageCacheService.prefetchImage(uri, undefined, CachePriority.LOW);

      expect(FastImage.preload).toHaveBeenCalled();
    });

    it('should handle local require() assets (number type)', () => {
      const localAsset = 123; // require('./image.png')
      imageCacheService.prefetchImage(localAsset);

      // Local assets should not trigger prefetch
      expect(FastImage.preload).not.toHaveBeenCalled();
    });
  });

  describe('prefetchImages', () => {
    it('should prefetch multiple images', () => {
      const items = [
        {uri: 'https://example.com/image1.jpg', thumbnailUri: 'https://example.com/thumb1.jpg'},
        {uri: 'https://example.com/image2.jpg', thumbnailUri: 'https://example.com/thumb2.jpg'},
      ];

      imageCacheService.prefetchImages(items);

      expect(FastImage.preload).toHaveBeenCalled();
    });

    it('should prefetch thumbnails first', () => {
      const items = [
        {uri: 'https://example.com/image1.jpg', thumbnailUri: 'https://example.com/thumb1.jpg'},
      ];

      imageCacheService.prefetchImages(items);

      expect(FastImage.preload).toHaveBeenCalled();
    });

    it('should handle empty array', () => {
      imageCacheService.prefetchImages([]);

      expect(FastImage.preload).not.toHaveBeenCalled();
    });

    it('should not prefetch duplicate images', () => {
      const items = [
        {uri: 'https://example.com/image1.jpg'},
        {uri: 'https://example.com/image1.jpg'},
      ];

      imageCacheService.prefetchImages(items);

      // Should only prefetch once
      expect(FastImage.preload).toHaveBeenCalledTimes(1);
    });
  });

  describe('isPrefetched', () => {
    it('should return true for prefetched image', () => {
      const uri = 'https://example.com/image.jpg';
      imageCacheService.prefetchImage(uri);

      expect(imageCacheService.isPrefetched(uri)).toBe(true);
    });

    it('should return false for non-prefetched image', () => {
      const uri = 'https://example.com/image.jpg';

      expect(imageCacheService.isPrefetched(uri)).toBe(false);
    });

    it('should return false for local assets', () => {
      expect(imageCacheService.isPrefetched(123)).toBe(false);
    });
  });

  describe('isThumbnailPrefetched', () => {
    it('should return true for prefetched thumbnail', () => {
      const uri = 'https://example.com/image.jpg';
      const thumbnailUri = 'https://example.com/thumb.jpg';
      imageCacheService.prefetchImage(uri, thumbnailUri);

      expect(imageCacheService.isThumbnailPrefetched(thumbnailUri)).toBe(true);
    });

    it('should return false for non-prefetched thumbnail', () => {
      const thumbnailUri = 'https://example.com/thumb.jpg';

      expect(imageCacheService.isThumbnailPrefetched(thumbnailUri)).toBe(false);
    });
  });

  describe('clearPrefetchTracking', () => {
    it('should clear prefetch tracking', () => {
      const uri = 'https://example.com/image.jpg';
      imageCacheService.prefetchImage(uri);
      expect(imageCacheService.isPrefetched(uri)).toBe(true);

      imageCacheService.clearPrefetchTracking();
      expect(imageCacheService.isPrefetched(uri)).toBe(false);
    });
  });

  describe('clearDiskCache', () => {
    it('should clear disk cache', async () => {
      await imageCacheService.clearDiskCache();

      expect(FastImage.clearDiskCache).toHaveBeenCalled();
    });
  });

  describe('clearMemoryCache', () => {
    it('should clear memory cache', () => {
      imageCacheService.clearMemoryCache();

      expect(FastImage.clearMemoryCache).toHaveBeenCalled();
    });
  });

  describe('clearAllCaches', () => {
    it('should clear all caches and tracking', async () => {
      const uri = 'https://example.com/image.jpg';
      imageCacheService.prefetchImage(uri);

      await imageCacheService.clearAllCaches();

      expect(FastImage.clearMemoryCache).toHaveBeenCalled();
      expect(FastImage.clearDiskCache).toHaveBeenCalled();
      expect(imageCacheService.isPrefetched(uri)).toBe(false);
    });
  });

  describe('getCacheSource', () => {
    it('should return cache source for string URI', () => {
      const uri = 'https://example.com/image.jpg';
      const source = imageCacheService.getCacheSource(uri);

      expect(source).toHaveProperty('uri', uri);
      expect(source).toHaveProperty('cache', 'immutable');
      expect(source).toHaveProperty('priority');
    });

    it('should return number for local asset', () => {
      const localAsset = 123;
      const source = imageCacheService.getCacheSource(localAsset);

      expect(source).toBe(123);
    });

    it('should use custom cache mode', () => {
      const uri = 'https://example.com/image.jpg';
      const source = imageCacheService.getCacheSource(uri, 'web');

      expect(source).toHaveProperty('cache', 'web');
    });

    it('should use custom priority', () => {
      const uri = 'https://example.com/image.jpg';
      const source = imageCacheService.getCacheSource(uri, 'immutable', CachePriority.HIGH);

      expect(source).toHaveProperty('priority', 'high');
    });
  });
});

