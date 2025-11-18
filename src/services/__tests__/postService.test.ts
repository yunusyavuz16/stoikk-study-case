/**
 * Tests for PostService
 * Covers post generation, pagination, search, and media handling
 */

import {postService} from '../postService';

// Mock API delay
jest.mock('@constants/api.constants', () => ({
  API_CONFIG: {
    MOCK_DELAY: 100,
  },
}));

describe('PostService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('getAllImageAssets', () => {
    it('should return all image assets with thumbnails', () => {
      const images = postService.getAllImageAssets();

      expect(images).toBeDefined();
      expect(Array.isArray(images)).toBe(true);
      expect(images.length).toBeGreaterThan(0);
      images.forEach(image => {
        expect(image).toHaveProperty('uri');
        expect(image).toHaveProperty('thumbnail');
      });
    });
  });

  describe('getAllVideoAssets', () => {
    it('should return all video assets with thumbnails and durations', () => {
      const videos = postService.getAllVideoAssets();

      expect(videos).toBeDefined();
      expect(Array.isArray(videos)).toBe(true);
      expect(videos.length).toBeGreaterThan(0);
      videos.forEach(video => {
        expect(video).toHaveProperty('uri');
        expect(video).toHaveProperty('thumbnail');
        expect(video).toHaveProperty('duration');
        expect(typeof video.duration).toBe('number');
      });
    });
  });

  describe('getPosts', () => {
    it('should fetch posts with pagination', async () => {
      const getPostsPromise = postService.getPosts(1, 10);
      jest.advanceTimersByTime(100);
      const result = await getPostsPromise;

      expect(result).toBeDefined();
      expect(result.posts).toBeDefined();
      expect(Array.isArray(result.posts)).toBe(true);
      expect(result.posts.length).toBe(10);
      expect(result.hasMore).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      expect(result.currentPage).toBe(1);
    });

    it('should return posts with correct structure', async () => {
      const getPostsPromise = postService.getPosts(1, 5);
      jest.advanceTimersByTime(100);
      const result = await getPostsPromise;

      result.posts.forEach(post => {
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('userId');
        expect(post).toHaveProperty('username');
        expect(post).toHaveProperty('type');
        expect(post).toHaveProperty('media');
        expect(post).toHaveProperty('caption');
        expect(post).toHaveProperty('likes');
        expect(post).toHaveProperty('comments');
        expect(post).toHaveProperty('timestamp');
        expect(post).toHaveProperty('isLiked');

        expect(['images', 'video']).toContain(post.type);
        expect(Array.isArray(post.media)).toBe(true);
        expect(post.media.length).toBeGreaterThan(0);
      });
    });

    it('should generate posts with exactly 2 images or 1 video', async () => {
      const getPostsPromise = postService.getPosts(1, 10);
      jest.advanceTimersByTime(100);
      const result = await getPostsPromise;

      result.posts.forEach(post => {
        if (post.type === 'images') {
          expect(post.media.length).toBe(2);
          post.media.forEach(media => {
            expect(media.type).toBe('image');
          });
        } else if (post.type === 'video') {
          expect(post.media.length).toBe(1);
          expect(post.media[0].type).toBe('video');
        }
      });
    });

    it('should handle pagination correctly', async () => {
      const page1Promise = postService.getPosts(1, 5);
      jest.advanceTimersByTime(100);
      const page1 = await page1Promise;

      const page2Promise = postService.getPosts(2, 5);
      jest.advanceTimersByTime(100);
      const page2 = await page2Promise;

      expect(page1.currentPage).toBe(1);
      expect(page2.currentPage).toBe(2);
      expect(page1.posts.length).toBe(5);
      expect(page2.posts.length).toBe(5);

      // Posts should have different IDs
      const page1Ids = page1.posts.map(p => p.id);
      const page2Ids = page2.posts.map(p => p.id);
      expect(page1Ids).not.toEqual(page2Ids);
    });

    it('should indicate when there are no more posts', async () => {
      const getPostsPromise = postService.getPosts(10, 10);
      jest.advanceTimersByTime(100);
      const result = await getPostsPromise;

      expect(result.hasMore).toBe(false);
    });

    it('should sort posts by timestamp descending', async () => {
      const getPostsPromise = postService.getPosts(1, 10);
      jest.advanceTimersByTime(100);
      const result = await getPostsPromise;

      for (let i = 0; i < result.posts.length - 1; i++) {
        expect(result.posts[i].timestamp).toBeGreaterThanOrEqual(
          result.posts[i + 1].timestamp,
        );
      }
    });
  });
});

