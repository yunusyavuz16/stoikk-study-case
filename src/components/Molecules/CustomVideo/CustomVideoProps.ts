import type { StyleProp, ViewStyle } from 'react-native';
import type { OnLoadData, OnProgressData } from 'react-native-video';

export interface CustomVideoProps {
  source: { uri: string } | number;
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
}
