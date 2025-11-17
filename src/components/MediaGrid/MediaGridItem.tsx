import { getCacheMode } from '@components/ImageWithThumbnail/utils/imageUtils';
import { PostVideo } from '@components/PostVideo/PostVideo';
import { useTheme } from '@hooks/useTheme';
import { CachePriority, imageCacheService } from '@services/imageCacheService';
import React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createStyles } from './MediaGridItem.styles';
import type { MediaGridItemProps } from './MediaGridItemProps';

/**
 * Individual media grid item component
 * Videos auto-play when visible based on viewability
 * Uses progressive image loading and optimized video player
 * Items are not pressable (no navigation to detail screen)
 */

export const MediaGridItem: React.FC<MediaGridItemProps> = React.memo(
  ({ id, type, uri, thumbnail, duration, isVisible }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    // Grid için sadece thumbnail göster: daha düşük çözünürlük, daha az decode maliyeti
    const thumbnailUri = thumbnail ?? uri;

    const thumbnailSource = (() => {
      const cacheMode = getCacheMode(thumbnailUri);
      return imageCacheService.getCacheSource(thumbnailUri, cacheMode, CachePriority.HIGH);
    })();

    return (
      <View style={styles.container} pointerEvents="none">
        {type === 'image' ? (
          <FastImage
            source={thumbnailSource}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <PostVideo
            video={{ id, type, uri, thumbnail, duration }}
            paused={!isVisible}
            isVisible={isVisible}
            showPlayButton={false}
            showTimer={true}
            enableTapToPlay={false}
          />
        )}
      </View>
    );
  },
);

MediaGridItem.displayName = 'MediaGridItem';
