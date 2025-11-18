import { API_CONFIG } from '@constants/api.constants';
import {
  CAPTIONS,
  IMAGE_THUMBNAILS,
  IMAGE_URIS,
  USERNAMES,
  VIDEO_DURATIONS,
  VIDEO_THUMBNAILS,
  VIDEO_URIS,
} from '@constants/post.constants';
import type { MediaItem, Post, PostType } from '../types/post.types';


interface VideoAsset {
  uri: string | number;
  duration: number;
  thumbnail: string | number;
}

interface ImageAsset {
  uri: string | number;
  thumbnail: string | number;
}




class PostService {

  public getAllImageAssets(): ImageAsset[] {
    return IMAGE_URIS.map((uri, index) => ({
      uri,
      thumbnail: IMAGE_THUMBNAILS[index],
    }));
  }


  public getAllVideoAssets(): VideoAsset[] {
    return VIDEO_URIS.map((uri, index) => ({
      uri,
      duration: VIDEO_DURATIONS[index],
      thumbnail: VIDEO_THUMBNAILS[index],
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
    const allImages = this.getAllImageAssets();
    const allVideos = this.getAllVideoAssets();
    const startIndex = (page - 1) * limit;

    // Generate posts with exactly 2 images or 1 video
    for (let i = 0; i < limit; i++) {
      const postIndex = startIndex + i;
      const username = USERNAMES[postIndex % USERNAMES.length];

      // Shuffle arrays for variety
      const shuffledImages = this.shuffleArray(allImages);
      const shuffledVideos = this.shuffleArray(allVideos);

      // Alternate between 2 images and 1 video
      const isVideoPost = postIndex % 2 === 1;

      let media: MediaItem[];
      let postType: PostType;

      if (isVideoPost) {
        // Single video post
        const videoAsset = shuffledVideos[0];
        const videoItem: MediaItem = {
          id: `video_${postIndex}_1`,
          type: 'video',
          uri: videoAsset.uri,
          duration: videoAsset.duration,
          thumbnail: videoAsset.thumbnail,
        };
        media = [videoItem];
        postType = 'video';
      } else {
        // Exactly 2 images post (swipeable carousel) with thumbnails
        const image1 = shuffledImages[0];
        const image2 = shuffledImages[1];
        media = [
          {
            id: `img_${postIndex}_1`,
            type: 'image',
            uri: image1.uri,
            thumbnail: image1.thumbnail,
          },
          {
            id: `img_${postIndex}_2`,
            type: 'image',
            uri: image2.uri,
            thumbnail: image2.thumbnail,
          },
        ];
        postType = 'images';
      }

      posts.push({
        id: `post_${postIndex}`,
        userId: `user_${postIndex}`,
        username,
        userAvatar: undefined,
        type: postType,
        media,
        caption: CAPTIONS[postIndex % CAPTIONS.length],
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
  async getPosts(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    posts: Post[];
    hasMore: boolean;
    total: number;
    currentPage: number;
  }> {
    return new Promise(resolve => {
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
}

export const postService = new PostService();
