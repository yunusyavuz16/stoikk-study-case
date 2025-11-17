import React from 'react';
import {View} from 'react-native';
import {ImageWithThumbnail} from '@components/ImageWithThumbnail/ImageWithThumbnail';
import {PostVideo} from '@components/PostVideo/PostVideo';
import {createStyles} from './MediaGridItem.styles';
import {useTheme} from '@hooks/useTheme';
import type {MediaGridItemProps} from './MediaGridItemProps';

/**
 * Individual media grid item component
 * Videos auto-play when visible based on viewability
 * Uses progressive image loading and optimized video player
 * Items are not pressable (no navigation to detail screen)
 */

export const MediaGridItem = React.memo<MediaGridItemProps>(
  ({item, isVisible}) => {
    const {theme} = useTheme();
    const styles = createStyles(theme);

    return (
      <View style={styles.container} pointerEvents="none">
        {item.type === 'image' ? (
          <ImageWithThumbnail
            uri={item.uri}
            thumbnailUri={item.thumbnail}
            style={styles.image}
            resizeMode="cover"
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
  },
);

MediaGridItem.displayName = 'MediaGridItem';

