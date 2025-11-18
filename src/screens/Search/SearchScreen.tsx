import { BackButton } from '@/components/Molecules/BackButton/BackButton';
import { MediaGrid } from '@/components/Organisms/MediaGrid/MediaGrid';
import { SearchHeader } from '@/components/Organisms/SearchHeader/SearchHeader';
import { useAutoFocus } from '@/screens/Search/hooks/useAutoFocus';
import { useBreakpoint } from '@hooks/useBreakpoint';
import { useTheme } from '@hooks/useTheme';
import React, { useDeferredValue, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyles } from './SearchScreen.styles';

/**
 * Displays search results in a responsive grid with auto-playing videos.
 */
export const SearchScreen: React.FC = () => {
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);

  const { breakpoint } = useBreakpoint();
  const searchInputRef = useRef<TextInput>(null);

  useAutoFocus({ inputRef: searchInputRef });
  const styles = createStyles(theme, breakpoint);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchHeader
        leftAccessory={
          <View style={styles.backButton}>
            <BackButton />
          </View>
        }
        searchBarRef={searchInputRef}
        searchBarProps={{
          value: searchQuery,
          onChangeText: setSearchQuery,
          placeholder: 'Search...',
        }}
        testID="search-screen-header"
      />
      <MediaGrid searchQuery={deferredQuery} />
    </SafeAreaView>
  );
};
