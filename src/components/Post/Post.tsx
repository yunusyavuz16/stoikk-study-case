import React, {useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {ThemedView} from '@components/ThemedView/ThemedView';
import {ThemedText} from '@components/ThemedText/ThemedText';
import {PostImageCarousel} from '@components/PostImageCarousel/PostImageCarousel';
import {PostVideo} from '@components/PostVideo/PostVideo';
import {Avatar} from '@components/Avatar/Avatar';
import {Icon} from '@components/Icon/Icon';
import {ICONS} from '@constants/icons.constants';
import {createStyles} from './Post.styles';
import type {PostProps} from './PostProps';

/**
 * Post component displaying user post with media
 * with memory optimization to pause videos when not visible
 */
export const Post = React.memo<PostProps>(({post, onLike, isVisible = true}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const handleLike = useCallback(() => {
    onLike(post.id);
  }, [post.id, onLike]);

  // Determine if we should use carousel (multiple items) or single video
  const hasMultipleMedia = post.media.length > 1;
  const isVideoOnly = post.type === 'video' && !hasMultipleMedia;

  // Pause video if post is not visible (memory optimization)
  const shouldPauseVideo = !isVisible;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedView style={styles.avatarContainer}>
          <Avatar uri={post.userAvatar} username={post.username} size={32} />
        </ThemedView>
        <ThemedText style={styles.username}>{post.username}</ThemedText>
      </ThemedView>

      {/* Media */}
      <ThemedView style={styles.mediaContainer}>
        {hasMultipleMedia || (post.type === 'images' && post.media.length > 0) ? (
          <PostImageCarousel media={post.media} isVisible={isVisible} />
        ) : isVideoOnly ? (
          <PostVideo video={post.media[0]} paused={shouldPauseVideo} isVisible={isVisible} />
        ) : null}
      </ThemedView>

      {/* Actions */}
      <ThemedView style={styles.actions}>
        <TouchableOpacity
          onPress={handleLike}
          style={styles.actionButton}
          accessibilityLabel={post.isLiked ? 'Unlike post' : 'Like post'}
          accessibilityRole="button">
          <Icon
            name={post.isLiked ? ICONS.HEART : ICONS.HEART_OUTLINE}
            size={24}
            color={post.isLiked ? theme.colors.like : theme.colors.text}
            family="Ionicons"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          accessibilityLabel="Comment on post"
          accessibilityRole="button">
          <Icon
            name={ICONS.CHATBUBBLE}
            size={24}
            color={theme.colors.text}
            family="Ionicons"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          accessibilityLabel="Share post"
          accessibilityRole="button">
          <Icon
            name={ICONS.SHARE}
            size={24}
            color={theme.colors.text}
            family="Ionicons"
          />
        </TouchableOpacity>
      </ThemedView>

      {/* Likes */}
      <ThemedText style={styles.likes}>{post.likes} likes</ThemedText>

      {/* Caption */}
      <ThemedText style={styles.caption}>
        <ThemedText style={styles.username}>{post.username}</ThemedText> {post.caption}
      </ThemedText>

      {/* Comments */}
      <ThemedText style={styles.comments}>View all {post.comments} comments</ThemedText>
    </ThemedView>
  );
});

Post.displayName = 'Post';

