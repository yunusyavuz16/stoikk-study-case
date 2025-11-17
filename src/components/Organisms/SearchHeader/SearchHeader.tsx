import { ThemedView } from '@/components/Atoms/ThemedView/ThemedView';
import { SearchBar } from '@/components/Molecules/SearchBar/SearchBar';
import type { SearchBarProps, SearchBarRef } from '@/components/Molecules/SearchBar/SearchBarProps';
import { useBreakpoint } from '@hooks/useBreakpoint';
import { useTheme } from '@hooks/useTheme';
import React, { ReactNode } from 'react';
import { TouchableOpacity, View, type StyleProp, type ViewStyle } from 'react-native';
import { createStyles } from './SearchHeader.styles';

export interface SearchHeaderProps {
  /**
   * Optional component rendered on the left side (e.g. back button).
   */
  leftAccessory?: ReactNode;
  /**
   * Optional component rendered on the right side (e.g. profile button).
   */
  rightAccessory?: ReactNode;
  /**
   * Props forwarded to the SearchBar instance.
   */
  searchBarProps?: SearchBarProps;
  /**
   * Ref forwarded to the SearchBar for imperative actions (focus, blur).
   */
  searchBarRef?: React.Ref<SearchBarRef>;
  /**
   * Callback triggered when the search area is pressed.
   * When provided, the SearchBar becomes read-only and acts as a trigger button.
   */
  onSearchPress?: () => void;
  /**
   * Optional accessibility label for the pressable search area.
   */
  searchPressAccessibilityLabel?: string;
  /**
   * Optional test identifier for the header container.
   */
  testID?: string;
  /**
   * Additional styles merged with the header container.
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Shared header component displaying an optional left/right accessory
 * alongside a search bar that can be interactive or act as a pressable trigger.
 */
export const SearchHeader: React.FC<SearchHeaderProps> = ({
  leftAccessory,
  rightAccessory,
  searchBarProps,
  searchBarRef,
  onSearchPress,
  searchPressAccessibilityLabel = 'Open search',
  testID,
  style,
}) => {
  const { theme } = useTheme();
  const { breakpoint } = useBreakpoint();
  const styles = createStyles(theme, breakpoint);

  const searchBarContent = (
    <View pointerEvents={onSearchPress ? 'none' : 'auto'} style={styles.searchBarContent}>
      <SearchBar ref={searchBarRef} {...searchBarProps} />
    </View>
  );

  return (
    <ThemedView style={[styles.container, style]} testID={testID}>
      {leftAccessory ? <View style={styles.accessory}>{leftAccessory}</View> : null}
      {onSearchPress ? (
        <TouchableOpacity
          style={styles.searchBarContainer}
          onPress={onSearchPress}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel={searchPressAccessibilityLabel}
        >
          {searchBarContent}
        </TouchableOpacity>
      ) : (
        <ThemedView style={styles.searchBarContainer}>{searchBarContent}</ThemedView>
      )}
      {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
    </ThemedView>
  );
};


