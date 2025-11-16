import React from 'react';
import {Pressable, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon} from '@components/Icon/Icon';
import {styles} from './BackButton.styles';
import type {BackButtonProps} from './BackButtonProps';

/**
 * Reusable back button component
 * Navigates back by default or uses custom onPress handler
 */
export const BackButton = React.memo<BackButtonProps>(
  ({
    onPress,
    iconColor,
    iconSize = 24,
    style,
    testID,
    accessibilityLabel = 'Go back',
  }) => {
    const navigation = useNavigation();

    const handlePress = () => {
      if (onPress) {
        onPress();
      } else {
        navigation.goBack();
      }
    };

    const containerStyle: ViewStyle[] = [styles.container, style].filter(
      (s): s is ViewStyle => s !== undefined,
    );

    return (
      <Pressable
        onPress={handlePress}
        style={containerStyle}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button">
        <Icon
          name="arrow-back"
          size={iconSize}
          color={iconColor || '#000000'}
          family="Ionicons"
        />
      </Pressable>
    );
  },
);

BackButton.displayName = 'BackButton';

