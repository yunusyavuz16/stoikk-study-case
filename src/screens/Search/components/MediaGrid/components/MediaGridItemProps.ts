import { MediaType } from "@/types/post.types";

export interface MediaGridItemProps {
  id: string;
  type: MediaType;
  uri: string | number; // Can be string URL or require() number
  thumbnail?: string | number; // Can be string URL or require() number
  duration?: number; // Video duration in seconds
  isVisible: boolean;
}
