import { StyleSheet } from 'react-native';
import { getResponsiveSpacing } from '@styles/theme';
import type { Theme } from '@styles/theme';
import type { Breakpoint } from '@utils/breakpoints';

/**
 * Creates responsive styles for the shared search header component.
 */
export const createStyles = (theme: Theme, breakpoint: Breakpoint) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      gap: getResponsiveSpacing('sm', breakpoint),
      paddingHorizontal: getResponsiveSpacing('md', breakpoint),
      paddingVertical: getResponsiveSpacing('sm', breakpoint),
    },
    accessory: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchBarContainer: {
      flex: 1,
    },
    searchBarContent: {
      flex: 1,
    },
  });


