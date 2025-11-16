import {StyleSheet, Dimensions} from 'react-native';
import {theme} from '@styles/theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: SCREEN_WIDTH, // Square aspect ratio
    backgroundColor: theme.colors.black,
    overflow: 'hidden', // Hide any controls that might appear outside bounds
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    opacity: 0.5,
  },
});

