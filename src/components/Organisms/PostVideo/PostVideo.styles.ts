import { StyleSheet } from 'react-native';
import type { Theme } from '@styles/theme';

/**
 * Create styles based on theme
 */
export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      aspectRatio: 4 / 5, // 4:5 ratio for videos
      backgroundColor: 'transparent',
      overflow: 'hidden', // Hide any controls that might appear outside bounds
    },
    video: {
      width: '100%',
      height: '100%',
    },
    thumbnail: {
      position: 'absolute',
      zIndex: 10,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    tapOverlay: {
      zIndex: 15,
    },
    playButtonContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 20,
    },
    playButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    playIconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: theme.spacing.xs,
    },
  });

