import { CustomVideo } from '@/components/Organisms/CustomVideo/CustomVideo';
import { useTheme } from '@hooks/useTheme';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import type { OnLoadData } from 'react-native-video';
import type { MediaItem } from '../../../types/post.types';
import { createStyles } from './PostVideo.styles';

interface PostVideoProps {
  video: MediaItem;
  paused?: boolean;
  isVisible?: boolean;
  showPlayButton?: boolean;
  showTimer?: boolean;
  enableTapToPlay?: boolean;
}

export const PostVideo: React.FC<PostVideoProps> = ({
  video,
  paused = false,
  isVisible = true,
  showPlayButton,
  showTimer,
  enableTapToPlay,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [hasVideoError, setHasVideoError] = useState(false);

  const handleVideoLoad = (_event: OnLoadData) => {
    setHasVideoError(false);
  };

  const handleVideoError = () => {
    setHasVideoError(true);
  };

  const getVideoSource = (uri: string | number) => {
    if (typeof uri === 'string') {
      return { uri };
    }
    return uri as any;
  };

  const getThumbnailSource = () => {
    // Use video thumbnail if available, otherwise use a placeholder
    if (video.thumbnail) {
      return typeof video.thumbnail === 'string' ? { uri: video.thumbnail } : video.thumbnail;
    }
    return undefined;
  };

  const thumbnailSource = getThumbnailSource();
  const shouldShowThumbnailFallback = Boolean(thumbnailSource && hasVideoError);

  const shouldPause = paused || !isVisible;

  const shouldEnableTapToPlay = enableTapToPlay !== undefined ? enableTapToPlay : isVisible;

  const shouldShowPlayButton =
    showPlayButton !== undefined ? showPlayButton : shouldPause || shouldEnableTapToPlay;

  const shouldShowTimer = showTimer !== undefined ? showTimer : isVisible && !shouldPause;

  return (
    <View style={styles.container} pointerEvents={shouldEnableTapToPlay ? 'auto' : 'none'}>
      {shouldShowThumbnailFallback && (
        <FastImage
          source={thumbnailSource}
          style={styles.thumbnail}
          resizeMode={FastImage.resizeMode.cover}
          pointerEvents="none"
        />
      )}

      <CustomVideo
        source={getVideoSource(video.uri)}
        paused={shouldPause}
        duration={video.duration}
        showTimer={shouldShowTimer}
        enableTapToPlay={shouldEnableTapToPlay}
        showPlayButton={shouldShowPlayButton}
        onLoad={handleVideoLoad}
        onPlaybackError={handleVideoError}
        muted={false}
        repeat={true}
        style={styles.video}
      />
    </View>
  );
};

PostVideo.displayName = 'PostVideo';
