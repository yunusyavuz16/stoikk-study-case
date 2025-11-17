import { BackButton } from '@/components/Molecules/BackButton/BackButton';
import { EmptyState } from '@/components/Molecules/EmptyState/EmptyState';
import { MediaGrid } from '@/screens/Search/components/MediaGrid/MediaGrid';
import { GridSkeleton } from '@/components/Molecules/Skeleton/Skeleton';
import { useBreakpoint } from '@hooks/useBreakpoint';
import { useSearchRTK } from '@/screens/Search/hooks/useSearchRTK';
import { useTheme } from '@hooks/useTheme';
import React, { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyles } from './SearchScreen.styles';
import { useResponsiveColumns } from '@/screens/Search/hooks/useResponsiveColumns';
import { useSearchInput } from '@/screens/Search/hooks/useSearchInput';
import { useAutoFocus } from '@/screens/Search/hooks/useAutoFocus';
import { SearchHeader } from '@/components/Organisms/SearchHeader/SearchHeader';

/**
 * Displays search results in a responsive grid with auto-playing videos.
 */
export const SearchScreen: React.FC = () => {
  const {theme} = useTheme();
  const {media, isLoading, error, search, clearSearch, hasInitialContent} = useSearchRTK();
  const {breakpoint} = useBreakpoint();
  const searchInputRef = useRef<TextInput>(null);
  const numColumns = useResponsiveColumns({breakpoint});
  const {searchQuery, handleSearchChange, retrySearch, hasSearchQuery} = useSearchInput({
    search,
    clearSearch,
  });
  useAutoFocus({inputRef: searchInputRef});
  const styles = createStyles(theme, breakpoint);

  const renderContent = () => {
    if (isLoading) {
      return <GridSkeleton numColumns={numColumns} />;
    }

    if (error) {
      return (
        <EmptyState
          type="network"
          message={error.message}
          onRetry={retrySearch}
        />
      );
    }

    if (media.length === 0 && hasSearchQuery) {
      return <EmptyState type="search" />;
    }

    if (media.length === 0 && !hasInitialContent) {
      return <GridSkeleton numColumns={numColumns} />;
    }

    return (
      <MediaGrid
        data={media}
        numColumns={numColumns}
      />
    );
  };

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
          onChangeText: handleSearchChange,
          placeholder: 'Search...',
        }}
        testID="search-screen-header"
      />
      {renderContent()}
    </SafeAreaView>
  );
};

