import type {StyleProp, ViewStyle} from 'react-native';
import type {OnLoadData, OnProgressData} from 'react-native-video';

export interface CustomVideoProps {
  source: {uri: string} | number;
  paused?: boolean;
  repeat?: boolean;
  muted?: boolean;
  resizeMode?: 'cover' | 'contain' | 'stretch';
  onLoad?: (data: OnLoadData) => void;
  onProgress?: (data: OnProgressData) => void;
  onEnd?: () => void;
  onPlaybackError?: (error: unknown) => void;
  style?: StyleProp<ViewStyle>;
  aggressiveMemoryMode?: boolean;
  duration?: number; // Video duration in seconds (required for timer)
  showTimer?: boolean; // Show countdown timer (default: true)
  enableTapToPlay?: boolean; // Enable tap to play/pause (default: false)
  showPlayButton?: boolean; // Show play button overlay when paused (default: true, only works if enableTapToPlay is true)
}
