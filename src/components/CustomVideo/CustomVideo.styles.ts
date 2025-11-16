import {StyleSheet} from 'react-native';
import {theme} from '@styles/theme';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  fallback: {
    backgroundColor: theme.colors.black,
  },
  timerContainer: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // theme.colors.black with 60% opacity
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    zIndex: 10,
  },
  timerText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    fontFamily: 'monospace',
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
    width: 80, // Fixed size for play button
    height: 80, // Fixed size for play button
    borderRadius: 40, // Half of width/height for perfect circle
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // theme.colors.black with 60% opacity
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)', // theme.colors.white with 80% opacity
  },
  playIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.xs, // Slight offset to visually center the play triangle
  },
  tapOverlay: {
    zIndex: 15,
  },
});