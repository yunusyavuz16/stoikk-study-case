/**
 * Tests for transformers
 * Covers data transformation utilities
 */

import {transformMediaItem, transformPost, transformPosts} from '../transformers';

describe('transformers', () => {
  describe('transformMediaItem', () => {
    it('should transform media item DTO', () => {
      const dto = {
        id: 'media_1',
        type: 'image',
        uri: 'https://example.com/image.jpg',
        thumbnail: 'https://example.com/thumb.jpg',
      };

      const result = transformMediaItem(dto);

      expect(result.id).toBe('media_1');
      expect(result.type).toBe('image');
      expect(result.uri).toBe('https://example.com/image.jpg');
      expect(result.thumbnail).toBe('https://example.com/thumb.jpg');
    });

    it('should handle missing fields with defaults', () => {
      const dto = {};

      const result = transformMediaItem(dto);

      expect(result.id).toBeDefined();
      expect(result.type).toBe('image');
    });

    it('should use url as fallback for uri', () => {
      const dto = {
        url: 'https://example.com/image.jpg',
      };

      const result = transformMediaItem(dto);

      expect(result.uri).toBe('https://example.com/image.jpg');
    });

    it('should preserve duration for videos', () => {
      const dto = {
        type: 'video',
        duration: 30,
      };

      const result = transformMediaItem(dto);

      expect(result.duration).toBe(30);
    });
  });

  describe('transformPost', () => {
    it('should transform post DTO', () => {
      const dto = {
        id: 'post_1',
        userId: 'user_1',
        username: 'testuser',
        type: 'images',
        media: [{id: 'img_1', type: 'image', uri: 'https://example.com/image.jpg'}],
        caption: 'Test caption',
        likes: 100,
        comments: 10,
        timestamp: 1234567890,
        isLiked: false,
      };

      const result = transformPost(dto);

      expect(result.id).toBe('post_1');
      expect(result.userId).toBe('user_1');
      expect(result.username).toBe('testuser');
      expect(result.type).toBe('images');
      expect(result.media.length).toBe(1);
      expect(result.caption).toBe('Test caption');
      expect(result.likes).toBe(100);
      expect(result.comments).toBe(10);
    });

    it('should handle missing fields with defaults', () => {
      const dto = {};

      const result = transformPost(dto);

      expect(result.id).toBeDefined();
      expect(result.userId).toBe('');
      expect(result.username).toBe('unknown');
      expect(result.likes).toBe(0);
      expect(result.comments).toBe(0);
    });

    it('should infer type from media', () => {
      const dto = {
        media: [{type: 'video'}],
      };

      const result = transformPost(dto);

      expect(result.type).toBe('video');
    });
  });

  describe('transformPosts', () => {
    it('should transform array of posts', () => {
      const dtos = [
        {id: 'post_1', username: 'user1'},
        {id: 'post_2', username: 'user2'},
      ];

      const result = transformPosts(dtos);

      expect(result.length).toBe(2);
      expect(result[0].id).toBe('post_1');
      expect(result[1].id).toBe('post_2');
    });

    it('should handle empty array', () => {
      const result = transformPosts([]);

      expect(result).toEqual([]);
    });
  });
});

