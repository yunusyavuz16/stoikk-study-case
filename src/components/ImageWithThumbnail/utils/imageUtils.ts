import type {CacheMode} from '@services/imageCacheService';

/**
 * Image utility functions
 * Provides helpers for image URI handling and cache configuration
 */

/**
 * Determines if a URI is a URL (string starting with http/https) or local asset (number)
 * @param uri - Image URI to check
 * @returns True if URI is a URL string, false otherwise
 */
export const isUrl = (uri: string | number): uri is string => {
  return typeof uri === 'string' && (uri.startsWith('http://') || uri.startsWith('https://'));
};

/**
 * Gets appropriate cache mode based on URI type
 * URLs use 'web' cache mode, local assets use 'immutable'
 * @param uri - Image URI to get cache mode for
 * @returns Cache mode appropriate for the URI type
 */
export const getCacheMode = (uri: string | number): CacheMode => {
  return isUrl(uri) ? 'web' : 'immutable';
};
