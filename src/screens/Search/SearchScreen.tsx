import { BackButton } from '@components/BackButton/BackButton';
import { EmptyState } from '@components/EmptyState/EmptyState';
import { MediaGrid } from '@components/MediaGrid/MediaGrid';
import { SearchBar } from '@components/SearchBar/SearchBar';
import { GridSkeleton } from '@components/Skeleton/Skeleton';
import { ThemedView } from '@components/ThemedView/ThemedView';
import { useBreakpoint } from '@hooks/useBreakpoint';
import { useSearchRTK } from '@hooks/useSearchRTK';
import { useTheme } from '@hooks/useTheme';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyles } from './SearchScreen.styles';

/**
 * Search screen displaying media in a grid layout
 * Videos auto-play when visible based on viewability
 * Searches posts by caption
 * Items are not clickable (no detail screen navigation)
 */
export const SearchScreen: React.FC = () => {
  const {theme} = useTheme();
  const {media, isLoading, error, search, clearSearch, hasInitialContent} = useSearchRTK();
  const {breakpoint} = useBreakpoint();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  const styles = createStyles(theme, breakpoint);

  // Calculate responsive numColumns based on breakpoint
  const numColumns = (() => {
    if (breakpoint === 'xl' || breakpoint === 'lg') {
      return 5;
    }
    if (breakpoint === 'md') {
      return 4;
    }
    return 3;
  })();

  const handleSearchChange = (text: string) => {
      setSearchQuery(text);
      const trimmed = text.trim();

      if (trimmed) {
        search(trimmed);
      } else {
        clearSearch();
      }
  }

  // Auto-focus search input when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Small delay to ensure the screen is fully mounted
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }, []),
  );


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.header}>
        <BackButton />
        <ThemedView style={styles.searchBarContainer}>
          <SearchBar
            ref={searchInputRef}
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search..."
          />
        </ThemedView>
      </ThemedView>
      {isLoading ? (
        <GridSkeleton numColumns={numColumns} />
      ) : error ? (
        <EmptyState
          type="network"
          message={error.message}
          onRetry={() => searchQuery.trim() && search(searchQuery.trim())}
        />
      ) : media.length === 0 && searchQuery.trim() ? (
        <EmptyState type="search" />
      ) : media.length === 0 && !hasInitialContent ? (
        <GridSkeleton numColumns={numColumns} />
      ) : (
        <MediaGrid
          data={media}
          numColumns={numColumns}
        />
      )}
    </SafeAreaView>
  );
};

