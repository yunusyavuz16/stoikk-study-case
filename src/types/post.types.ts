export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string;
  type: MediaType;
  uri: string | number; // Can be string URL or require() number
  thumbnail?: string | number; // Can be string URL or require() number
  duration?: number; // Video duration in seconds
}

export type PostType = 'images' | 'video';

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  type: PostType;
  media: MediaItem[];
  caption: string;
  likes: number;
  comments: number;
  timestamp: number;
  isLiked: boolean;
}

export interface MediaItemDTO {
  id: string;
  type: MediaType;
  uri: string | number;
  url: string | number;
  thumbnail: string | number;
  thumbUrl: string | number;
  duration?: number;
}
