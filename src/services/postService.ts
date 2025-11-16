import {API_CONFIG} from '@constants/api.constants';
import type {Post, PostType, MediaItem} from '../types/post.types';

/**
 * Video asset with duration information
 */
interface VideoAsset {
  uri: string | number;
  duration: number;
}

/**
 * Video duration mapping (in seconds)
 * Based on predefined video durations
 * Index corresponds to video-1 through video-10
 */
// 12,8.5,14,13.3,7.9,8.4,5.8,10.3,7.5,7.1
const VIDEO_DURATIONS: number[] = [12, 8.5, 14, 13.3, 7.9, 8.4, 5.8, 10.3, 7.5, 7.1];

/**
 * Mock post service
 * Generates diverse mock posts with various media combinations
 */
class PostService {
  public getAllImageAssets() {
    return [
      require('../assets/images/image-1.png'),
      require('../assets/images/image-2.png'),
      require('../assets/images/image-3.png'),
      require('../assets/images/image-4.png'),
      require('../assets/images/image-5.png'),
      require('../assets/images/image-6.png'),
      require('../assets/images/image-7.png'),
      require('../assets/images/image-8.png'),
      require('../assets/images/image-9.png'),
      require('../assets/images/image-10.png'),
    ];
  }

  /**
   * Get all video assets with their durations
   * Returns an array of objects containing uri and duration
   */
  public getAllVideoAssets(): VideoAsset[] {
    const videoUris = [
      require('../assets/videos/video-1.mp4'),
      require('../assets/videos/video-2.mp4'),
      require('../assets/videos/video-3.mp4'),
      require('../assets/videos/video-4.mp4'),
      require('../assets/videos/video-5.mp4'),
      require('../assets/videos/video-6.mp4'),
      require('../assets/videos/video-7.mp4'),
      require('../assets/videos/video-8.mp4'),
      require('../assets/videos/video-9.mp4'),
      require('../assets/videos/video-10.mp4'),
    ];

    return videoUris.map((uri, index) => ({
      uri,
      duration: VIDEO_DURATIONS[index],
    }));
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private generateMockPosts(page: number = 1, limit: number = 10): Post[] {
    const posts: Post[] = [];
    const usernames = ['johndoe', 'janedoe', 'photographer', 'traveler', 'artist', 'explorer', 'creator', 'wanderer'];
    const captions = [
      'Beautiful sunset today! 🌅',
      'Exploring new places',
      'Life is beautiful',
      'Nature never fails to amaze',
      'Living the moment',
      'Adventure awaits',
      'Making memories',
      'Chasing dreams',
      'Every moment is a new beginning',
      'Finding beauty in simplicity',
    ];

    const allImages = this.getAllImageAssets();
    const allVideos = this.getAllVideoAssets();
    const startIndex = (page - 1) * limit;

    // Generate diverse post types
    for (let i = 0; i < limit; i++) {
      const postIndex = startIndex + i;
      const postType = postIndex % 5; // 5 different post types
      const username = usernames[postIndex % usernames.length];
      let media: MediaItem[] = [];
      let postTypeName: PostType = 'images';

      // Shuffle arrays for variety
      const shuffledImages = this.shuffleArray(allImages);
      const shuffledVideos = this.shuffleArray(allVideos);

      switch (postType) {
        case 0: // Single image (20%)
          media = [
            {
              id: `img_${postIndex}_1`,
              type: 'image',
              uri: shuffledImages[0],
            },
          ];
          postTypeName = 'images';
          break;

        case 1: // Multiple images (2-5 images) (20%)
          const imageCount = 2 + (postIndex % 4); // 2-5 images
          media = Array.from({length: imageCount}, (_, idx) => ({
            id: `img_${postIndex}_${idx + 1}`,
            type: 'image' as const,
            uri: shuffledImages[idx % shuffledImages.length],
          }));
          postTypeName = 'images';
          break;

        case 2: // Single video (20%)
          {
            const videoAsset = shuffledVideos[0];
            const videoItem: MediaItem = {
              id: `video_${postIndex}_1`,
              type: 'video',
              uri: videoAsset.uri,
              duration: videoAsset.duration,
            };
            media = [videoItem];
            postTypeName = 'video';
          }
          break;

        case 3: // Multiple videos (2-3 videos) (20%)
          const videoCount = 2 + (postIndex % 2); // 2-3 videos
          media = Array.from({length: videoCount}, (_, idx): MediaItem => {
            const videoAsset = shuffledVideos[idx % shuffledVideos.length];
            return {
              id: `video_${postIndex}_${idx + 1}`,
              type: 'video' as const,
              uri: videoAsset.uri,
              duration: videoAsset.duration,
            };
          });
          postTypeName = 'video';
          break;

        case 4: // Mixed media (images + videos) (20%)
          const mixedImageCount = 1 + (postIndex % 3); // 1-3 images
          const mixedVideoCount = 1 + (postIndex % 2); // 1-2 videos
          const mixedMedia: MediaItem[] = [];

          // Add images first
          for (let imgIdx = 0; imgIdx < mixedImageCount; imgIdx++) {
            mixedMedia.push({
              id: `mixed_${postIndex}_img_${imgIdx + 1}`,
              type: 'image',
              uri: shuffledImages[imgIdx % shuffledImages.length],
            });
          }

          // Add videos
          for (let vidIdx = 0; vidIdx < mixedVideoCount; vidIdx++) {
            const videoAsset = shuffledVideos[vidIdx % shuffledVideos.length];
            const videoItem: MediaItem = {
              id: `mixed_${postIndex}_vid_${vidIdx + 1}`,
              type: 'video',
              uri: videoAsset.uri,
              duration: videoAsset.duration,
            };
            mixedMedia.push(videoItem);
          }

          media = mixedMedia;
          // For mixed media, determine type based on first item
          postTypeName = media[0].type === 'image' ? 'images' : 'video';
          break;
      }

      posts.push({
        id: `post_${postIndex}`,
        userId: `user_${postIndex}`,
        username,
        userAvatar: undefined,
        type: postTypeName,
        media,
        caption: captions[postIndex % captions.length],
        likes: Math.floor(Math.random() * 1000) + 50,
        comments: Math.floor(Math.random() * 100) + 5,
        timestamp: Date.now() - postIndex * 3600000,
        isLiked: Math.random() > 0.7,
      });
    }

    return posts.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Fetch posts with pagination
   */
  async getPosts(page: number = 1, limit: number = 10): Promise<{
    posts: Post[];
    hasMore: boolean;
    total: number;
    currentPage: number;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = this.generateMockPosts(page, limit);
        const totalPages = 10; // Simulate 10 pages of content
        const hasMore = page < totalPages;

        resolve({
          posts,
          hasMore,
          total: totalPages * limit,
          currentPage: page,
        });
      }, API_CONFIG.MOCK_DELAY);
    });
  }

  /**
   * Search posts by caption
   */
  async searchPosts(query: string): Promise<Post[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a larger set of posts for search
        const allPosts: Post[] = [];
        for (let page = 1; page <= 10; page++) {
          const pagePosts = this.generateMockPosts(page, 10);
          allPosts.push(...pagePosts);
        }

        // Filter posts by caption (case-insensitive)
        const lowerQuery = query.toLowerCase().trim();
        const matchingPosts = allPosts.filter(post =>
          post.caption.toLowerCase().includes(lowerQuery) ||
          post.username.toLowerCase().includes(lowerQuery)
        );

        resolve(matchingPosts);
      }, API_CONFIG.MOCK_DELAY);
    });
  }
}

export const postService = new PostService();

