import { PostVideo } from '@/components/Organisms/PostVideo/PostVideo';
import { useTheme } from '@hooks/useTheme';
import { CachePriority, imageCacheService } from '@services/imageCacheService';
import React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createStyles } from './MediaGridItem.styles';
import type { MediaGridItemProps } from './MediaGridItemProps';
import { getCacheMode } from '@/components/Molecules/ImageWithThumbnail/utils/imageUtils';

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

    const videoContent = isVisible ? (
      <PostVideo
        video={{ id, type, uri, thumbnail, duration }}
        paused={!isVisible}
        isVisible={isVisible}
        showPlayButton={false}
        showTimer={true}
        enableTapToPlay={false}
        showInitialThumbnailOverlay={true}
        thumbnailOverlayDelayMs={10}
      />
    ) : (
      <FastImage
        source={thumbnailSource}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
    );

    return (
      <View style={styles.container} pointerEvents="none">
        {type === 'image' ? (
          <FastImage
            source={thumbnailSource}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          videoContent
        )}
      </View>
    );
  },
);

MediaGridItem.displayName = 'MediaGridItem';
