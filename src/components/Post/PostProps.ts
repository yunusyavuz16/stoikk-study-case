import type { MediaItem, PostType } from '../../types/post.types';

export interface PostProps {
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
  onLike: (postId: string) => void;
  isVisible?: boolean;
}

