import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {CustomVideo} from '@components/CustomVideo';
import type {MediaItem} from '../../types/post.types';
import {styles} from './PostVideo.styles';

interface PostVideoProps {
  video: MediaItem;
  paused?: boolean;
  isVisible?: boolean;
}

/**
 * Video player component for posts with aggressive memory management
 * CRITICAL: Uses minimal buffers and bitrate limits to prevent OOM crashes
 * Includes thumbnail fallback when paused
 * Optimized for 4:5 aspect ratio and visibility-based autoplay/pause
 */
export const PostVideo = React.memo<PostVideoProps>(({video, paused = false, isVisible = true}) => {
  const getVideoSource = (uri: string | number) => {
    if (typeof uri === 'string') {
      return {uri};
    }
    return uri as any;
  };

  const getThumbnailSource = () => {
    // Use video thumbnail if available, otherwise use a placeholder
    if (video.thumbnail) {
      return typeof video.thumbnail === 'string' ? {uri: video.thumbnail} : video.thumbnail;
    }
    return null;
  };

  const thumbnailSource = getThumbnailSource();

  // Determine if video should be paused based on visibility
  // Video should be paused if:
  // 1. Explicitly paused via prop, OR
  // 2. Post is not visible
  const shouldPause = paused || !isVisible;

  // Enable tap to play when visible (allows user to manually play/pause)
  // When visible and not explicitly paused, video should autoplay
  const enableTapToPlay = isVisible;

  // Show play button when:
  // 1. Video is paused (either explicitly or because not visible), OR
  // 2. Tap to play is enabled (so user can see play button when they manually pause)
  // This ensures play button is always visible when video is paused, including manual pauses
  const showPlayButton = shouldPause || enableTapToPlay;

  // Show timer only when visible and playing (not paused)
  const showTimer = isVisible && !shouldPause;

  return (
    <View style={styles.container}>
      {/* Thumbnail fallback (shown behind video when paused) */}
      {thumbnailSource && shouldPause && (
        <FastImage
          source={thumbnailSource}
          style={styles.thumbnail}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      {/* Always render video component for smooth transitions */}
      {/* CustomVideo handles paused state internally for memory optimization */}
      <CustomVideo
        source={getVideoSource(video.uri)}
        paused={shouldPause}
        style={styles.video}
        duration={video.duration}
        showTimer={showTimer}
        enableTapToPlay={enableTapToPlay}
        showPlayButton={showPlayButton}
        muted={false}
        repeat={true}
      />
    </View>
  );
});

PostVideo.displayName = 'PostVideo';
