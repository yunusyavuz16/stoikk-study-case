import { postService } from '@services/postService';
import { transformPosts } from '@utils/transformers';
import type { Post } from '../../types/post.types';
import { baseApi } from './baseApi';

interface GetPostsParams {
  page: number;
  limit?: number;
}

interface GetPostsResponse {
  posts: Post[];
  hasMore: boolean;
  total: number;
  currentPage: number;
}

interface ToggleLikeParams {
  postId: string;
}

/**
 * Posts API slice with RTK Query
 * Handles posts fetching, searching, and like toggling
 */
export const postsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    /**
     * Get posts with pagination
     */
    getPosts: builder.query<GetPostsResponse, GetPostsParams>({
      queryFn: async ({ page, limit = 10 }) => {
        try {
          const response = await postService.getPosts(page, limit);
          return {
            data: {
              posts: transformPosts(response.posts),
              hasMore: response.hasMore,
              total: response.total,
              currentPage: response.currentPage,
            },
          };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to fetch posts',
            },
          };
        }
      },
      providesTags: ['Post'],
      // Keep unused data for 5 minutes
      keepUnusedDataFor: 300,
    }),

    /**
     * Toggle like on a post (optimistic update)
     */
    toggleLike: builder.mutation<{ post: Post }, ToggleLikeParams>({
      queryFn: async () => {
        // Optimistic update - in real app, this would call API
        // For now, we'll return success and let the component handle the update
        return {
          data: {
            post: {} as Post, // Will be updated optimistically
          },
        };
      },
      invalidatesTags: ['Post'],
      // Optimistic updates will be handled in component
    }),
  }),
});

export const { useGetPostsQuery, useLazyGetPostsQuery, useToggleLikeMutation } = postsApi;
