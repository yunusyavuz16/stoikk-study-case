import { ThemedView } from '@/components/Atoms/ThemedView/ThemedView';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useTheme } from '@hooks/useTheme';
import type { Theme } from '@styles/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleProp, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Shimmer skeleton component for loading states
 * Provides smooth shimmer animation
 * Supports dark mode theming
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    return () => animation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.7, 0.3],
  });

  return (
    <ThemedView style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
            opacity,
          },
        ]}
      />
    </ThemedView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      position: 'relative',
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
  });

/**
 * Post skeleton component
 * Supports dark mode theming
 */
export const PostSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const styles = createPostSkeletonStyles(theme);
  const { width: SCREEN_WIDTH } = useBreakpoint();

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <Skeleton width={32} height={32} borderRadius={16} />
        <Skeleton width={100} height={16} style={styles.username} />
      </ThemedView>
      {/* Media */}
      <Skeleton width={SCREEN_WIDTH} height={SCREEN_WIDTH} borderRadius={0} />
      {/* Actions */}
      <ThemedView style={styles.actions}>
        <Skeleton width={24} height={24} borderRadius={12} />
        <Skeleton width={24} height={24} borderRadius={12} style={styles.actionSpacing} />
        <Skeleton width={24} height={24} borderRadius={12} style={styles.actionSpacing} />
      </ThemedView>
      {/* Caption */}
      <Skeleton width="80%" height={14} style={styles.caption} />
      <Skeleton width="60%" height={14} />
    </ThemedView>
  );
};

const createPostSkeletonStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      marginBottom: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    username: {
      marginLeft: theme.spacing.md,
    },
    actions: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    actionSpacing: {
      marginLeft: theme.spacing.md,
    },
    caption: {
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
      marginHorizontal: theme.spacing.md,
    },
  });

/**
 * Image skeleton component
 */
export const ImageSkeleton: React.FC<{ size?: number }> = ({ size }) => {
  const { width: SCREEN_WIDTH } = useBreakpoint();
  const imageSize = size || SCREEN_WIDTH;

  return <Skeleton width={imageSize} height={imageSize} borderRadius={0} />;
};

/**
 * Grid skeleton component
 * Supports dark mode theming
 */
export const GridSkeleton: React.FC<{ numColumns?: number }> = ({ numColumns = 3 }) => {
  const { width: SCREEN_WIDTH } = useBreakpoint();
  const itemSize = SCREEN_WIDTH / numColumns;
  const skeletonItems = Array.from({ length: 6 }, (_, index) => ({
    id: `skeleton-${index}`,
    index,
  }));

  return (
    <ThemedView style={gridSkeletonStyles.outerContainer}>
      <ThemedView style={gridSkeletonStyles.container}>
        {skeletonItems.map(item => (
          <ImageSkeleton key={item.id} size={itemSize} />
        ))}
      </ThemedView>
      <ThemedView style={gridSkeletonStyles.container}>
        {skeletonItems.map(item => (
          <ImageSkeleton key={item.id} size={itemSize} />
        ))}
      </ThemedView>
      <ThemedView style={gridSkeletonStyles.container}>
        {skeletonItems.map(item => (
          <ImageSkeleton key={item.id} size={itemSize} />
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const gridSkeletonStyles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
