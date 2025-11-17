import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon } from '@components/Icon/Icon';
import { SearchBar } from '@components/SearchBar/SearchBar';
import { ThemedView } from '@components/ThemedView/ThemedView';
import { ICONS } from '@constants/icons.constants';
import { useBreakpoint } from '@hooks/useBreakpoint';
import { useTheme } from '@hooks/useTheme';
import { createStyles } from './FeedHeader.styles';


export interface FeedHeaderProps {
  onSearchPress: () => void;
  onProfilePress: () => void;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({ onSearchPress, onProfilePress }) => {
  const { theme } = useTheme();
  const { breakpoint } = useBreakpoint();
  const styles = createStyles(theme, breakpoint);

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

