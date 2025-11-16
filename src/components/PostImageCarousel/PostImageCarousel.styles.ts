import {StyleSheet, Dimensions} from 'react-native';
import {theme} from '@styles/theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: SCREEN_WIDTH, // Square aspect ratio
    backgroundColor: theme.colors.black,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    overflow: 'hidden', // Hide any controls that might appear outside bounds
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
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

