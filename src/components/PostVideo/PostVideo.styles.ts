import {StyleSheet, Dimensions} from 'react-native';
import {theme} from '@styles/theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 4 / 5, // 4:5 ratio for videos
    backgroundColor: theme.colors.black,
    overflow: 'hidden', // Hide any controls that might appear outside bounds
  },
  video: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
});

