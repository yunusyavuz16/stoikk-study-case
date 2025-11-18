/**
 * Tests for imageUtils
 * Covers image utility functions
 */

import {isUrl, getCacheMode} from '../imageUtils';

describe('imageUtils', () => {
  describe('isUrl', () => {
    it('should return true for http URLs', () => {
      expect(isUrl('http://example.com/image.jpg')).toBe(true);
    });

    it('should return true for https URLs', () => {
      expect(isUrl('https://example.com/image.jpg')).toBe(true);
    });

    it('should return false for local require() assets', () => {
      expect(isUrl(123)).toBe(false);
    });

    it('should return false for non-URL strings', () => {
      expect(isUrl('not-a-url')).toBe(false);
      expect(isUrl('file://local/path')).toBe(false);
    });
  });

  describe('getCacheMode', () => {
    it('should return web for HTTP URLs', () => {
      expect(getCacheMode('http://example.com/image.jpg')).toBe('web');
    });

    it('should return web for HTTPS URLs', () => {
      expect(getCacheMode('https://example.com/image.jpg')).toBe('web');
    });

    it('should return immutable for local assets', () => {
      expect(getCacheMode(123)).toBe('immutable');
    });

    it('should return immutable for non-URL strings', () => {
      expect(getCacheMode('local-path')).toBe('immutable');
    });
  });
});

