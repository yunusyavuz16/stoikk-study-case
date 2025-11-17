import { Icon } from '@/components/Atoms/Icon/Icon';
import { SearchHeader } from '@/components/Organisms/SearchHeader/SearchHeader';
import { ICONS } from '@constants/icons.constants';
import { useBreakpoint } from '@hooks/useBreakpoint';
import { useTheme } from '@hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStyles } from './FeedHeader.styles';

export const FeedHeader: React.FC = () => {
  const { theme } = useTheme();
  const { breakpoint } = useBreakpoint();
  const styles = createStyles(theme, breakpoint);
  const navigation = useNavigation();

  const onSearchPress = () => {
    navigation.navigate('Search');
  };

  const onProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <SearchHeader
      style={styles.container}
      onSearchPress={onSearchPress}
      searchBarProps={{ placeholder: 'Search', disabled: true }}
      searchPressAccessibilityLabel="Go to search"
      rightAccessory={
        <TouchableOpacity
          onPress={onProfilePress}
          style={styles.profileButton}
          accessibilityLabel="Go to profile"
          accessibilityRole="button">
          <Icon name={ICONS.PROFILE} size={24} color={theme.colors.text} family="Ionicons" />
        </TouchableOpacity>
      }
    />
  );
};
