import React, {useMemo} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {PostVideo} from '@components/PostVideo/PostVideo';
import {createStyles} from './MediaGridItem.styles';
import {useTheme} from '@hooks/useTheme';
import type {MediaGridItemProps} from './MediaGridItemProps';
import {imageCacheService, CachePriority} from '@services/imageCacheService';
import {getCacheMode} from '@components/ImageWithThumbnail/utils/imageUtils';

/**
 * Individual media grid item component
 * Videos auto-play when visible based on viewability
 * Uses progressive image loading and optimized video player
 * Items are not pressable (no navigation to detail screen)
 */

export const MediaGridItem = React.memo<MediaGridItemProps>(({item, isVisible}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  // Grid için sadece thumbnail göster: daha düşük çözünürlük, daha az decode maliyeti
  const thumbnailUri = item.thumbnail ?? item.uri;

  const thumbnailSource = useMemo(() => {
    const cacheMode = getCacheMode(thumbnailUri);
    return imageCacheService.getCacheSource(
      thumbnailUri,
      cacheMode,
      CachePriority.HIGH,
    );
  }, [thumbnailUri]);

  return (
    <View style={styles.container} pointerEvents="none">
      {item.type === 'image' ? (
        <FastImage
          source={thumbnailSource}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <PostVideo
          video={item}
          paused={!isVisible}
          isVisible={isVisible}
          showPlayButton={false}
          showTimer={true}
          enableTapToPlay={false}
        />
      )}
    </View>
  );
});

MediaGridItem.displayName = 'MediaGridItem';

