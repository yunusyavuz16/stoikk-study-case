/**
 * Tests for postsApi
 * Covers posts API endpoints
 */

import {postsApi} from '../postsApi';
import {postService} from '@services/postService';
import {transformPosts} from '@utils/transformers';

jest.mock('@services/postService', () => ({
  postService: {
    getPosts: jest.fn(),
    searchPosts: jest.fn(),
  },
}));

jest.mock('@utils/transformers', () => ({
  transformPosts: jest.fn((posts) => posts),
}));

describe('postsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should be configured correctly', () => {
    expect(postsApi).toBeDefined();
  });

  describe('getPosts endpoint', () => {
    it('should fetch posts and transform them', async () => {
      const mockResponse = {
        posts: [{id: 'post_1'}],
        hasMore: true,
        total: 10,
        currentPage: 1,
      };

      (postService.getPosts as jest.Mock).mockResolvedValue(mockResponse);

      const store = require('@reduxjs/toolkit').configureStore({
        reducer: {
          [require('../baseApi').baseApi.reducerPath]: require('../baseApi').baseApi.reducer,
        },
        middleware: (getDefaultMiddleware: any) =>
          getDefaultMiddleware().concat(require('../baseApi').baseApi.middleware),
      });

      await store.dispatch(
        postsApi.endpoints.getPosts.initiate({page: 1, limit: 10}),
      );

      expect(postService.getPosts).toHaveBeenCalledWith(1, 10);
      expect(transformPosts).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      (postService.getPosts as jest.Mock).mockRejectedValue(new Error('Failed'));

      const store = require('@reduxjs/toolkit').configureStore({
        reducer: {
          [require('../baseApi').baseApi.reducerPath]: require('../baseApi').baseApi.reducer,
        },
        middleware: (getDefaultMiddleware: any) =>
          getDefaultMiddleware().concat(require('../baseApi').baseApi.middleware),
      });

      const result = await store.dispatch(
        postsApi.endpoints.getPosts.initiate({page: 1, limit: 10}),
      );

      expect(result).toHaveProperty('error');
    });
  });

  describe('toggleLike endpoint', () => {
    it('should return success', async () => {
      const store = require('@reduxjs/toolkit').configureStore({
        reducer: {
          [require('../baseApi').baseApi.reducerPath]: require('../baseApi').baseApi.reducer,
        },
        middleware: (getDefaultMiddleware: any) =>
          getDefaultMiddleware().concat(require('../baseApi').baseApi.middleware),
      });

      const result = await store.dispatch(
        postsApi.endpoints.toggleLike.initiate({postId: 'post_1'}),
      );

      expect(result.data).toBeDefined();
    });
  });
});

