import { Icon } from '@/components/Atoms/Icon/Icon';
import { ThemedView } from '@/components/Atoms/ThemedView/ThemedView';
import { SearchBar } from '@/components/Molecules/SearchBar/SearchBar';
import { ICONS } from '@constants/icons.constants';
import { useBreakpoint } from '@hooks/useBreakpoint';
import { useTheme } from '@hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
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
    <ThemedView style={styles.header}>
      <TouchableOpacity
        style={styles.searchBarContainer}
        onPress={onSearchPress}
        activeOpacity={1}
        accessibilityLabel="Go to search"
        accessibilityRole="button">
        <View pointerEvents="none" style={styles.searchBarContent}>
          <SearchBar />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onProfilePress}
        style={styles.profileButton}
        accessibilityLabel="Go to profile"
        accessibilityRole="button">
        <Icon name={ICONS.PROFILE} size={24} color={theme.colors.text} family="Ionicons" />
      </TouchableOpacity>
    </ThemedView>
  );
};
