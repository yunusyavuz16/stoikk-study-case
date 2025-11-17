import {StyleSheet, Dimensions} from 'react-native';
import type {Theme} from '@styles/theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

/**
 * Create styles based on theme
 */
export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      aspectRatio: 4 / 5, // 4:5 ratio for all media
      backgroundColor: 'transparent', // Transparent to prevent black placeholder
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      flexDirection: 'row',
    },
    imageContainer: {
      width: SCREEN_WIDTH,
      aspectRatio: 4 / 5, // 4:5 ratio for each media item
      overflow: 'hidden', // Hide any controls that might appear outside bounds
      backgroundColor: 'transparent', // Transparent to prevent black placeholder
    },
    image: {
      width: '100%',
      height: '100%',
    },
    pagination: {
      position: 'absolute',
      bottom: theme.spacing.sm,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: 'rgba(255, 255, 255, 0.5)', // theme.colors.white with 50% opacity
      marginHorizontal: theme.spacing.xs / 2,
    },
    dotActive: {
      backgroundColor: theme.colors.white,
      width: 8,
      height: 8,
      borderRadius: theme.borderRadius.sm,
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
      zIndex: 1,
    },
    errorContainer: {
      backgroundColor: theme.colors.border,
    },
  });

