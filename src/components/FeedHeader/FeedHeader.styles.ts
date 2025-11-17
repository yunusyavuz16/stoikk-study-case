import { StyleSheet } from 'react-native';
import { getResponsiveSpacing } from '@styles/theme';
import type { Theme } from '@styles/theme';
import type { Breakpoint } from '@utils/breakpoints';

/**
 * Creates styles for the feed header component.
 */
export const createStyles = (theme: Theme, breakpoint: Breakpoint) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: getResponsiveSpacing('md', breakpoint),
      paddingVertical: getResponsiveSpacing('sm', breakpoint),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    searchBarContainer: {
      flex: 1,
      marginRight: getResponsiveSpacing('sm', breakpoint),
    },
    searchBarContent: {
      flex: 1,
    },
    profileButton: {
      padding: getResponsiveSpacing('sm', breakpoint),
    },
  });

