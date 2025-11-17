import type {CacheMode} from '@services/imageCacheService';


export const isUrl = (uri: string | number): uri is string => {
  return typeof uri === 'string' && (uri.startsWith('http://') || uri.startsWith('https://'));
};

export const getCacheMode = (uri: string | number): CacheMode => {
  return isUrl(uri) ? 'web' : 'immutable';
};
