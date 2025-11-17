import {StyleSheet} from 'react-native';
import type {Theme} from '@styles/theme';

/**
 * Create styles based on theme
 */
export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      aspectRatio: 4 / 5, // 4:5 aspect ratio (width:height)
      backgroundColor: 'transparent', // Transparent to prevent white placeholder
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    video: {
      width: '100%',
      height: '100%',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    errorContainer: {
      backgroundColor: theme.colors.border,
    },
  });

